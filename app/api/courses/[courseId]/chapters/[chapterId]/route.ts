import Mux from '@mux/mux-node';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

const { Video } = new Mux(
	process.env.MUX_TOKEN_ID!,
	process.env.MUX_TOKEN_SECRET!
);

export async function DELETE(
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

		const chapter = await db.chapter.findUnique({
			where: { id: chapterId, courseId },
		});

		if (!chapter) {
			return new NextResponse('Not Found', { status: 404 });
		}

		if (chapter.videoUrl) {
			const existingMuxData = await db.muxData.findFirst({
				where: {
					chapterId,
				},
			});

			if (existingMuxData) {
				await Video.Assets.del(existingMuxData.assetId);

				await db.muxData.delete({
					where: {
						id: existingMuxData.id,
					},
				});
			}
		}

		const deletedChapter = await db.chapter.delete({
			where: { id: chapterId },
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

		return NextResponse.json(deletedChapter);
	} catch (error) {
		console.log(
			'[ERROR] DELETE /api/courses/[courseId]/chapters/[chapterId]',
			error
		);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

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

		if (values.videoUrl) {
			const existingMuxData = await db.muxData.findFirst({
				where: {
					chapterId,
				},
			});

			if (existingMuxData) {
				await Video.Assets.del(existingMuxData.assetId);

				await db.muxData.delete({
					where: {
						id: existingMuxData.id,
					},
				});
			}

			const assess = await Video.Assets.create({
				input: values.videoUrl,
				playback_policy: 'public',
				test: false,
			});

			await db.muxData.create({
				data: {
					chapterId,
					assetId: assess.id,
					playbackId: assess.playback_ids?.[0].id,
				},
			});
		}

		return NextResponse.json(chapter);
	} catch (error) {
		console.log(
			'[ERROR] PATCH /api/courses/[courseId]/chapters/[chapterId]',
			error
		);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
