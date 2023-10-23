import { db } from '@/lib/db';
import { Attachment, Chapter } from '@prisma/client';

interface GetChapterProps {
	userId: string;
	courseId: string;
	chapterId: string;
}

export const getChapter = async ({
	userId,
	courseId,
	chapterId,
}: GetChapterProps) => {
	try {
		const purchase = await db.purchase.findUnique({
			where: {
				userId_courseId: {
					userId,
					courseId,
				},
			},
		});

		const course = await db.course.findUnique({
			where: {
				id: courseId,
				isPublished: true,
			},
			select: {
				price: true,
			},
		});

		const chapter = await db.chapter.findUnique({
			where: {
				id: chapterId,
				courseId,
			},
		});

		if (!chapter || !course) {
			// after this code, the function will stop running and return the error message is not found
			throw new Error('Chapter or course not found');
		}

		let muxData = null;
		let attachments: Attachment[] = [];
		let nextChapter: Chapter | null = null;

		if (purchase) {
			attachments = await db.attachment.findMany({
				where: {
					courseId,
				},
			});
		}

		if (chapter.isFree || purchase) {
			muxData = await db.muxData.findUnique({
				where: {
					chapterId,
				},
			});

			nextChapter = await db.chapter.findFirst({
				where: {
					courseId,
					isPublished: true,
					position: {
						// gt = greater than
						gt: chapter.position,
					},
				},
				orderBy: { position: 'asc' },
			});
		}

		const userProgress = await db.userProgress.findUnique({
			where: {
				userId_chapterId: {
					userId,
					chapterId,
				},
			},
		});

		return {
			chapter,
			course,
			muxData,
			attachments,
			nextChapter,
			userProgress,
			purchase,
		};
	} catch (error) {
		console.log('[ERROR] getChapter', error);

		return {
			chapter: null,
			course: null,
			muxData: null,
			attachments: [],
			nextChapter: null,
			userProgress: null,
			purchase: null,
		};
	}
};
