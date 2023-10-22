import { db } from '@/lib/db';

export const getProgress = async (
	userId: string,
	courseId: string
): Promise<number> => {
	try {
		const publishedChapters = await db.chapter.findMany({
			where: {
				courseId,
				isPublished: true,
			},
			select: {
				id: true,
			},
		});

		const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

		const validCompletedChapters = await db.userProgress.count({
			where: {
				userId,
				chapterId: {
					in: publishedChapterIds,
				},
				isCompleted: true,
			},
		});

		const progressPercentage =
			(validCompletedChapters / publishedChapters.length) * 100;

		return progressPercentage;
	} catch (error) {
		console.log('Error getting progress: ', error);
		return 0;
	}
};
