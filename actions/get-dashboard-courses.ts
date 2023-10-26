import { db } from '@/lib/db';
import { Category, Chapter, Course } from '@prisma/client';
import { getProgress } from './get-progress';

type CoursesWithProgressWithCategory = Course & {
	category: Category;
	chapters: Chapter[];
	progress: number | null;
};

type DashboardCourses = {
	completedCourses: any[];
	coursesInProgress: any[];
};

export const getDashboardCourses = async (
	userId: string
): Promise<DashboardCourses> => {
	try {
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
		) as CoursesWithProgressWithCategory[];

		for (let course of courses) {
			const progress = await getProgress(userId, course.id);

			course.progress = progress;
		}

		const completedCourses = courses.filter(
			(course) => course.progress === 100
		);
		const coursesInProgress = courses.filter(
			// (course.progress ?? 0) < 100 is making sure that if progress is null, it will be 0 instead of null so that it can be compared to 100
			(course) => (course.progress ?? 0) < 100
		);

		return {
			completedCourses,
			coursesInProgress,
		};
	} catch (error) {
		console.log('Error in getDashboardCourses: ', error);

		return {
			completedCourses: [],
			coursesInProgress: [],
		};
	}
};
