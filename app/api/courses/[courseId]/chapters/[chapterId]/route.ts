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

		const { isPublished, ...values } = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const ownCourse = db.course.findUnique({
			where: { id: courseId, userId },
		});

		if (!ownCourse) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const chapter = await db.chapter.update({
			where: { id: chapterId, courseId },
			data: { ...values },
		});

		return NextResponse.json(chapter);
	} catch (error) {
		console.log(
			'[ERROR] PATCH /api/courses/[courseId]/chapters/[chapterId]',
			error
		);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
