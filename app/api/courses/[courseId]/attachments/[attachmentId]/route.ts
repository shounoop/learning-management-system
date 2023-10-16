import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string; attachmentId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const courseOwner = await db.course.findUnique({
			where: { id: params.courseId, userId },
		});

		if (!courseOwner) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const attachment = await db.attachment.delete({
			where: { id: params.attachmentId, courseId: params.courseId },
		});

		return NextResponse.json(attachment);
	} catch (error) {
		console.log(
			'[ERROR] DELETE /api/courses/[courseId]/attachments/[attachmentId]',
			error
		);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
