import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { userId } = auth();

		const { courseId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const course = await db.course.findUnique({
			where: { id: courseId, userId },
		});

		if (!course) {
			return new NextResponse('Not Found', { status: 404 });
		}

		const unpublishedCourse = await db.course.update({
			where: { id: courseId, userId },
			data: { isPublished: false },
		});

		return NextResponse.json(unpublishedCourse);
	} catch (error) {
		console.log('[ERROR] PATCH /api/courses/[courseId]/unpublish', error);

		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
