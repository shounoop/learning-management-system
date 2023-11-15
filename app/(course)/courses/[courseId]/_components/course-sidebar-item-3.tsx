'use client';

import { cn } from '@/lib/utils';
import { Book } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface CourseSidebarItem3Props {
	label?: string;
	isCompleted?: boolean;
	courseId?: string;
}

const CourseSidebarItem3 = ({
	label,
	isCompleted,
	courseId,
}: CourseSidebarItem3Props) => {
	const pathname = usePathname();
	const router = useRouter();

	const isActive = pathname?.includes(`/courses/${courseId}/detail`);

	const onClick = () => {
		router.push(`/courses/${courseId}/detail`);
	};

	return (
		<button
			onClick={onClick}
			type="button"
			className={cn(
				'flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20',
				isActive &&
					'text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700',
				isCompleted && 'text-emerald-700 hover:text-emerald-700',
				isCompleted && isActive && 'bg-emerald-200/20'
			)}
		>
			<div className="flex items-center gap-x-2 py-4">
				<Book
					size={22}
					className={cn(
						'text-slate-500',
						isActive && 'text-slate-700',
						isCompleted && 'text-emerald-700'
					)}
				/>

				<p className="text-left">{label}</p>
			</div>

			<div
				className={cn(
					'ml-auto opacity-0 border-2 border-slate-700 h-full transition-all',
					isActive && 'opacity-100',
					isCompleted && 'border-emerald-700'
				)}
			/>
		</button>
	);
};

export default CourseSidebarItem3;
