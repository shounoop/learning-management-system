import { Star } from 'lucide-react';
import Image from 'next/image';

interface FeedbackProps {
	course: any;
}

const Feedback = ({ course }: FeedbackProps) => {
	return (
		<div className="border border-blue-200 rounded-md p-4">
			<div className="flex">
				<div className='w-[48px] h-[48px] relative'>
					{course?.imageUrl && (
						<Image
							className="rounded-full shadow-md object-cover"
							src={course.imageUrl}
							alt="course-image"
							fill
						/>
					)}
				</div>

				<div className="ml-4">
					<div className="flex items-center">
						<div
							className="
        font-bold text-sm text-slate-800
        "
						>
							Hoang Minh
						</div>

						<div className="px-2">•</div>

						<div className="text-sm text-slate-500">{`3 days ago`}</div>
					</div>

					<div className="flex items-center text-orange-400">
						{`4`} <Star className="ml-1 w-4 h-4 fill-current" />
					</div>
				</div>
			</div>

			<div className="mt-4">rất tuyệt vời</div>
		</div>
	);
};

export default Feedback;
