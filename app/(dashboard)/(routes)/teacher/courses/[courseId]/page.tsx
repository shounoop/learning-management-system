import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { LayoutDashboard } from 'lucide-react';
import { redirect } from 'next/navigation';
import TitleForm from './_components/title-form';
import DescriptionForm from './_components/description-form';
import ImageForm from './_components/image-form';

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
	const { userId } = auth();

	const goToHomePage = () => {
		redirect('/');
	};

	if (!userId) {
		return goToHomePage();
	}

	const course = await db.course.findUnique({
		where: {
			id: params.courseId,
		},
	});

	const categories = await db.category.findMany({
		orderBy: {
			name: 'asc',
		},
	});

	if (!course) {
		return goToHomePage();
	}

	const requiredFields = [
		course.title,
		course.description,
		course.imageUrl,
		course.price,
		course.categoryId,
	];

	const totalFields = requiredFields.length;

	// filter(Boolean) removes all falsy values from the array
	const completedFields = requiredFields.filter(Boolean).length;

	const completionText = `${completedFields} of ${totalFields} fields completed`;

	return (
		<div className="p-6">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-y-2">
					<h1 className="text-2xl font-medium">Course setup</h1>

					<span className="text-sm text-slate-700">{completionText}</span>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
				<div>
					<div className="flex items-center gap-x-2">
						<IconBadge icon={LayoutDashboard} />

						<h2 className="text-xl">Customize your course</h2>
					</div>

					<TitleForm initialData={course} courseId={course.id} />
					<DescriptionForm initialData={course} courseId={course.id} />
					<ImageForm initialData={course} courseId={course.id} />
				</div>
			</div>
		</div>
	);
};

export default CourseIdPage;
