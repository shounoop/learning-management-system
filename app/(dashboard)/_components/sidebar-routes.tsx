// use client to avoid SSR error
'use client';

import {
	ActivitySquare,
	BarChart,
	Compass,
	Heart,
	Layout,
	List,
} from 'lucide-react';
import SidebarItem from './sidebar-item';
import { usePathname } from 'next/navigation';

const learnerRoutes = [
	{
		icon: Layout,
		label: 'Dashboard',
		href: '/',
	},
	{
		icon: Compass,
		label: 'Browse',
		href: '/search',
	},
	{
		icon: ActivitySquare,
		label: 'Customization',
		href: '/personalization',
	},
];

const teacherRoutes = [
	{
		icon: List,
		label: 'Courses',
		href: '/teacher/courses',
	},
	{
		icon: BarChart,
		label: 'Analystics',
		href: '/teacher/analytics',
	},
];

const SidebarRoutes = () => {
	const pathname = usePathname();

	const isTeacherPage = pathname?.startsWith('/teacher');

	const routes = isTeacherPage ? teacherRoutes : learnerRoutes;

	return (
		<div className="flex flex-col w-full">
			{routes.map((route) => {
				return (
					<SidebarItem
						key={route.href}
						icon={route.icon}
						label={route.label}
						href={route.href}
					/>
				);
			})}
		</div>
	);
};

export default SidebarRoutes;
