'use client';

import { Preview } from '@/components/preview';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import Image from 'next/image';
import FeedbackItem from './_components/feedback-item';
import FeedbackForm from './_components/feedback-form';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Feedback as Feedback } from '@prisma/client';
import { useAuth } from '@clerk/nextjs';

const CourseDetailPage = ({ params }: { params: { courseId: string } }) => {
	const { courseId } = params;

	const { userId } = useAuth();

	const [course, setCourse] = useState<any>(null);
	const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
	const [isFeedbacked, setIsFeedbacked] = useState(false);

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

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get(`/api/courses/${courseId}/feedbacks`);

				setFeedbacks(res.data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [courseId]);

	useEffect(() => {
		if (!feedbacks.length || !userId) return;

		feedbacks.forEach((feedback) => {
			if (feedback.userId === userId) {
				setIsFeedbacked(true);
			}
		});
	}, [feedbacks, userId]);

	const afterSentFeedback = (newFeedback: Feedback) => {
		setFeedbacks((prev) => [...prev, newFeedback]);
		setIsFeedbacked(true);
	};

	return (
		<div className="p-8">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 center-content">
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

					<div className="px-4">
						<Button className="mt-4 w-full">Continue Studying</Button>
					</div>
				</div>

				<div>
					{course?.imageUrl && (
						<div className="w-full h-[350px] relative">
							<Image
								className="rounded-md shadow-md object-cover "
								src={course.imageUrl}
								alt="course-image"
								fill
							/>
						</div>
					)}

					<div className="flex mt-6 items-center">
						<div className="flex items-center text-orange-400 font-bold text-xl">
							{`4/5`}
							<Star className="w-4 h-4 ml-1 fill-current" />
						</div>

						<div className="ml-3 text-sm text-slate-500">{`(${feedbacks.length} đánh giá)`}</div>
					</div>
				</div>
			</div>

			<div className="mt-12 pl-4">
				<div className="text-2xl font-bold mt-8 mb-4">Feedbacks</div>

				<div className="grid grid-cols-1 gap-y-3">
					{feedbacks.map((feedback, index) => (
						<FeedbackItem
							key={feedback.id}
							content={feedback.content}
							fullName={feedback.fullName}
							imageUrl={feedback.avatarUrl}
							rating={5}
							duration={index + 1}
						/>
					))}
				</div>

				{course && !isFeedbacked && (
					<FeedbackForm
						courseId={course.id}
						afterSentFeedback={afterSentFeedback}
					/>
				)}
			</div>
		</div>
	);
};

export default CourseDetailPage;
