'use client';

import { UserButton, useAuth } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import SearchInput from './search-input';
import { isTeacher } from '@/lib/teacher';
import { ModeToggle } from './mode-toggle';
import { ChatVideoButton } from './chat-video-button';

const NavbarRoutes = () => {
	const { userId } = useAuth();

	const pathname = usePathname();

	const isTeacherPage = pathname?.startsWith('/teacher');
	const isCoursePage = pathname?.includes('/courses');
	const isSearchPage = pathname?.startsWith('/search');

	return (
		<>
			{isSearchPage && (
				<div className="hidden md:block">
					<SearchInput />
				</div>
			)}

			<div className="flex gap-x-2 ml-auto">
				<div className="pr-6">
					<ChatVideoButton />
				</div>

				<div className="pr-6">
					<ModeToggle />
				</div>

				{isTeacherPage || isCoursePage ? (
					<Link href="/">
						<Button size={'sm'} variant={'ghost'}>
							<LogOut className="h-4 w-4 mr-2" />
							Exit
						</Button>
					</Link>
				) : isTeacher(userId) ? (
					<Link href="/teacher/courses">
						<Button size={'sm'} variant={'ghost'}>
							Admin mode
						</Button>
					</Link>
				) : null}

				<UserButton afterSignOutUrl="/" />
			</div>
		</>
	);
};

export default NavbarRoutes;
