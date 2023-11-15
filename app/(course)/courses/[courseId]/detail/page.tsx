'use client';

import { Preview } from '@/components/preview';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Feedback from './_components/feedback';
import FeedbackForm from './_components/feedback-form';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Detail = ({ params }: { params: { courseId: string } }) => {
	const { courseId } = params;

	const [course, setCourse] = useState<any>(null);

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get(`/api/courses/${courseId}`);

				setCourse(res.data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [courseId]);

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

				{course && <FeedbackForm initialData={course} courseId={course.id} />}
			</div>
		</div>
	);
};

export default Detail;
