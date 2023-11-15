import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { userId } = auth();

		// const user = await currentUser();

		const { content } = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const feedback = await db.feedback.create({
			data: {
				content,
				courseId: params.courseId,
				userId,
			},
		});

		// const resFeedback = {
		// 	...feedback,
		// 	avatarUrl: user?.imageUrl,
		// 	fullname: `${user?.firstName} ${user?.lastName}`,
		// };

		return NextResponse.json(feedback);
	} catch (error) {
		console.log('ERROR IN POST FEEDBACK', error);

		return new NextResponse('Internal server error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const feedback = await db.feedback.findMany({
			where: {
				courseId: params.courseId,
			},
		});

		// const resFeedback = feedback.map((feedback) => ({
		// 	...feedback,
		// 	avatarUrl: feedback.user.imageUrl,
		// 	fullname: `${feedback.user.firstName} ${feedback.user.lastName}`,
		// }));

		return NextResponse.json(feedback);
	} catch (error) {
		console.log('ERROR IN GET FEEDBACK', error);

		return new NextResponse('Internal server error', { status: 500 });
	}
}
