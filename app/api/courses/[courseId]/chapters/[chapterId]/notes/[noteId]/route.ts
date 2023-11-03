import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function DELETE(
	req: Request,
	{
		params,
	}: { params: { courseId: string; chapterId: string; noteId: string } }
) {
	try {
		const { userId } = auth();

		const { chapterId, noteId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const note = await db.note.delete({
			where: {
				id: noteId,
				userId,
				chapterId,
			},
		});

		return NextResponse.json(note);
	} catch (error) {
		console.log(
			'[ERROR] DELETE /api/courses/[courseId]/chapters/[chapterId]/notes/[noteId]',
			error
		);
		return new NextResponse('Internal server error', { status: 500 });
	}
}
