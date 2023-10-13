import { LucideIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const backgroundVariant = cva('rounded-full flex item-center justify-center', {
	variants: {
		variant: {
			default: 'bg-slate-100',
			success: 'bg-emerald-100',
		},
		size: {
			default: 'p-2',
			sm: 'p-1',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
});

const iconVariants = cva('', {
	variants: {
		variant: {
			default: 'text-sky-700',
			success: 'text-emerald-700',
		},
		size: {
			default: 'w-8 h-8',
			sm: 'w-4 h-4',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
});

type BackgroundVariantProps = VariantProps<typeof backgroundVariant>;
type IconVariantProps = VariantProps<typeof iconVariants>;

interface IconBadgeProps extends BackgroundVariantProps, IconVariantProps {
	icon: LucideIcon;
}

export const IconBadge = ({ icon: Icon, variant, size }: IconBadgeProps) => (
	<div className={cn(backgroundVariant({ variant, size }))}>
		<Icon className={cn(iconVariants({ variant, size }))} />
	</div>
);
