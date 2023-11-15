import { Preview } from '@/components/preview';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';
import { auth } from '@clerk/nextjs';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Feedback from './_components/feedback';

const Detail = async ({ params }: { params: { courseId: string } }) => {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}

	const course = await db.course.findUnique({
		where: {
			id: params.courseId,
		},
		include: {
			chapters: {
				where: { isPublished: true },
				include: { userProgresses: { where: { userId } } },
				orderBy: { position: 'asc' },
			},
		},
	});

	return (
		<div className="p-8">
			<div
				className="grid grid-cols-1 sm:grid-cols-2 gap-6 center-content
			"
			>
				<div>
					<div className="px-[15px] py-[12px] text-3xl font-bold">
						{course?.title}
					</div>

					<div
						className={cn(
							'text-sm mt-2',
							!course?.description && 'text-slate-500 italic'
						)}
					>
						{!course?.description && 'No description'}

						{course?.description && <Preview value={course?.description} />}
					</div>

					<Button className="mt-4 w-full">Continue Studying</Button>
				</div>

				<div>
					{course?.imageUrl && (
						<Image
							className="rounded-md shadow-md object-cover "
							src={course.imageUrl}
							alt="course-image"
							width={500}
							height={350}
						/>
					)}

					<div className="flex mt-6 items-center">
						<div className="flex items-center text-orange-400 font-bold text-xl">
							{`4.9/5`}
							<Star className="w-4 h-4 ml-1 fill-current" />
						</div>

						<div className="ml-3 text-sm text-slate-500">{`(105 đánh giá)`}</div>
					</div>
				</div>
			</div>

			<div>
				<div className="text-2xl font-bold mt-8 mb-4">Feedbacks</div>

				<div className="grid grid-cols-1 gap-y-3">
					<Feedback course={course} />

					<Feedback course={course} />
				</div>
			</div>
		</div>
	);
};

export default Detail;
