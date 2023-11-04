import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { Category, Chapter, Course } from '@prisma/client';
import { NextResponse } from 'next/server';

type CourseWithProgressWithCategory = Course & {
	category: Category;
	chapters: Chapter[];
	progress: number | null;
};

export async function GET(req: Request) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const purchasedCourses = await db.purchase.findMany({
			where: { userId },
			select: {
				course: {
					include: {
						category: true,
						chapters: { where: { isPublished: true } },
					},
				},
			},
		});

		const courses = purchasedCourses.map(
			(purchasedCourse) => purchasedCourse.course
		) as CourseWithProgressWithCategory[];

		for (let course of courses) {
			let progressPercentage = 0;

			const publishedChapters = await db.chapter.findMany({
				where: {
					courseId: course.id,
					isPublished: true,
				},
				select: {
					id: true,
				},
			});

			const publishedChapterIds = publishedChapters.map(
				(chapter) => chapter.id
			);

			const validCompletedChapters = await db.userProgress.count({
				where: {
					userId,
					chapterId: {
						in: publishedChapterIds,
					},
					isCompleted: true,
				},
			});

			progressPercentage =
				(validCompletedChapters / publishedChapters.length) * 100;

			const progress = progressPercentage;

			course.progress = progress;
		}

		const completedCourses = courses.filter(
			(course) => course.progress === 100
		);
		const coursesInProgress = courses.filter(
			// (course.progress ?? 0) < 100 is making sure that if progress is null, it will be 0 instead of null so that it can be compared to 100
			(course) => (course.progress ?? 0) < 100
		);

		return NextResponse.json({
			completedCourses,
			coursesInProgress,
		});
	} catch (error) {
		console.log('ERROR GET /api/courses/dashboard');
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
