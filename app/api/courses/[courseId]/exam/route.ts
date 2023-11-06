import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PUT(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { userId } = auth();

		const { courseId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const { ...values } = await req.json();

		const exam = await db.exam.upsert({
			where: {
				userId_courseId: {
					userId,
					courseId,
				},
			},
			update: { ...values },
			create: {
				userId,
				courseId,
				...values,
			},
		});

		return NextResponse.json(exam);
	} catch (error) {
		console.log(['[ERROR] PUT /api/courses/[courseId]/exam', error]);
		return new NextResponse('Internal server error', { status: 500 });
	}
}
