import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

const CoursesPage = async () => {
	const { userId } = auth();

	if (!userId) return redirect('/');

	const courses = await db.course.findMany({
		where: {
			userId,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	return (
		<div className="p-6">
			<DataTable columns={columns} data={courses} />
		</div>
	);
};

export default CoursesPage;
