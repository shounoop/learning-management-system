import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
	const courseId = params.courseId;

	const course = await db.course.findUnique({
		where: {
			id: courseId,
		},
		include: {
			chapters: {
				where: { isPublished: true },
				orderBy: { position: 'asc' },
			},
			category: true,
		},
	});

	if (!course) return redirect('/');

	if (course.category?.id) {
		const courseStatistic = await db.courseStatistic.findUnique({
			where: { courseId },
		});

		if (!courseStatistic) {
			await db.courseStatistic.create({
				data: {
					courseId,
					views: 1,
					categoryId: course.category?.id,
				},
			});
		} else {
			await db.courseStatistic.update({
				where: {
					courseId,
				},
				data: {
					views: courseStatistic.views + 1,
				},
			});
		}
	}

	return redirect(`/courses/${course.id}/detail`);
};

export default CourseIdPage;
