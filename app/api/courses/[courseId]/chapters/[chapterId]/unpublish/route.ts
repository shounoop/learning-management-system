import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		const { userId } = auth();

		const { courseId, chapterId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const ownCourse = db.course.findUnique({
			where: { id: courseId, userId },
		});

		if (!ownCourse) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const unpublishedChapter = await db.chapter.update({
			where: { id: chapterId, courseId },
			data: { isPublished: false },
		});

		const publishedChaptersInCourse = await db.chapter.findMany({
			where: { courseId, isPublished: true },
		});

		if (publishedChaptersInCourse.length === 0) {
			await db.course.update({
				where: { id: courseId },
				data: { isPublished: false },
			});
		}

		return NextResponse.json(unpublishedChapter);
	} catch (error) {
		console.log(
			'[ERROR] PATCH /api/courses/[courseId]/chapters/[chapterId]/unpublish',
			error
		);

		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
