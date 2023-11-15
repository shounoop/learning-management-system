import { Preview } from '@/components/preview';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface FeedbackItemProps {
	imageUrl: string;
	fullName: string;
	duration: number;
	content: string;
	rating: number;
}

const FeedbackItem = ({
	imageUrl,
	fullName,
	duration,
	content,
	rating,
}: FeedbackItemProps) => {
	return (
		<div className="border border-blue-200 rounded-md p-4">
			<div className="flex">
				<div className="w-[48px] h-[48px] relative">
					<Image
						className="rounded-full shadow-md object-cover"
						src={imageUrl}
						alt="course-image"
						fill
					/>
				</div>

				<div className="ml-4">
					<div className="flex items-center">
						<div className="font-bold text-sm text-slate-800">{fullName}</div>

						<div className="px-2">•</div>

						<div className="text-sm text-slate-500">{`${duration} days ago`}</div>
					</div>

					<div className="flex items-center text-orange-400 font-semibold">
						{rating} <Star className="ml-1 w-4 h-4 fill-current" />
					</div>
				</div>
			</div>

			<div className="mt-4">
				<Preview value={content} />
			</div>
		</div>
	);
};

export default FeedbackItem;
