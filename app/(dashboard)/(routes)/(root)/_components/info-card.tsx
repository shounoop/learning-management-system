import { IconBadge } from '@/components/icon-badge';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
	numberOfItems: number;
	variant?: 'default' | 'success';
	label: string;
	icon: LucideIcon;
}

const InfoCard = ({
	icon: Icon,
	label,
	variant,
	numberOfItems,
}: InfoCardProps) => {
	return (
		<div className="border rounded-md flex items-center gap-x-2 p-3 mb-4">
			<IconBadge icon={Icon} variant={variant} />

			<div>
				<p className="font-medium">{label}</p>

				<p className="text-gray-500 text-sm">{`${numberOfItems} ${
					numberOfItems === 1 ? 'Course' : 'Courses'
				}`}</p>
			</div>
		</div>
	);
};

export default InfoCard;
