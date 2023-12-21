'use client';

import CoursesList from '@/components/courses-list';
import { CheckCircle, Clock, LayoutDashboard } from 'lucide-react';
import InfoCard from './_components/info-card';
import { useEffect, useState } from 'react';
import { Category, Chapter, Course, CourseStatistic } from '@prisma/client';
import axios from 'axios';
import { STORAGE_KEY } from '@/constants/storage';
import { DASHBOARD_ITEM_ID } from '@/constants/dashboard-item-id';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';
import { isTeacher } from '@/lib/teacher';
import { redirect } from 'next/navigation';
import { IconBadge } from '@/components/icon-badge';
import { RecommendCourse } from '@/types';
import RecommendedCourses from '@/components/recommended-courses';

type CourseWithProgressWithCategory = Course & {
	category: Category;
	chapters: Chapter[];
	progress: number | null;
};

const Dashboard = () => {
	const { userId } = useAuth();

	if (isTeacher(userId)) redirect('/teacher/courses');

	const [dashboardSetting, setDashboardSetting] = useState<string[]>();
	const [completedCourses, setCompletedCourses] =
		useState<CourseWithProgressWithCategory[]>();
	const [coursesInProgress, setCoursesInProgress] =
		useState<CourseWithProgressWithCategory[]>();
	const [recommendedCourses, setRecommendedCourses] =
		useState<RecommendCourse[]>();

	useEffect(() => {
		const setDataFromLocalStorageToStates = () => {
			setCompletedCourses(
				JSON.parse(localStorage.getItem(STORAGE_KEY.completedCourses) || '[]')
			);

			setCoursesInProgress(
				JSON.parse(localStorage.getItem(STORAGE_KEY.coursesInProgress) || '[]')
			);

			setDashboardSetting(
				JSON.parse(localStorage.getItem(STORAGE_KEY.dashboardSetting) || '[]')
			);

			setRecommendedCourses(
				JSON.parse(localStorage.getItem(STORAGE_KEY.recommendedCourse) || '[]')
			);
		};

		setDataFromLocalStorageToStates();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get(`/api/courses/dashboard`);

				setCompletedCourses(res.data.completedCourses);
				setCoursesInProgress(res.data.coursesInProgress);

				localStorage.setItem(
					STORAGE_KEY.completedCourses,
					JSON.stringify(res.data.completedCourses)
				);
				localStorage.setItem(
					STORAGE_KEY.coursesInProgress,
					JSON.stringify(res.data.coursesInProgress)
				);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get(`/api/courses/recommend`);

				setRecommendedCourses(res.data);

				localStorage.setItem(
					STORAGE_KEY.recommendedCourse,
					JSON.stringify(res.data)
				);
			} catch (error) {
				console.log(error);
			}
		})();
	});

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get(`/api/personalization`);

				if (res?.data?.dashboard) {
					const parsedDashboardSetting = JSON.parse(res.data.dashboard);

					setDashboardSetting(parsedDashboardSetting);

					localStorage.setItem(
						STORAGE_KEY.dashboardSetting,
						res.data.dashboard
					);
				}
			} catch (error) {
				console.log('ERROR IN DASHBOARD', error);
			}
		})();
	}, []);

	return (
		<div className="p-6 space-y-4">
			<div
				className={cn(
					'grid grid-cols-1 sm:grid-cols-2 gap-4',
					dashboardSetting?.length === 1 && 'sm:grid-cols-1'
				)}
			>
				{coursesInProgress &&
					((dashboardSetting &&
						dashboardSetting?.includes(DASHBOARD_ITEM_ID.inProgress)) ||
						!dashboardSetting) && (
						<div>
							<InfoCard
								icon={Clock}
								label="In Progress"
								numberOfItems={coursesInProgress.length}
							/>

							<CoursesList
								size={dashboardSetting?.length === 1 ? 'sm' : 'lg'}
								items={coursesInProgress}
							/>
						</div>
					)}

				{completedCourses &&
					((dashboardSetting &&
						dashboardSetting?.includes(DASHBOARD_ITEM_ID.completed)) ||
						!dashboardSetting) && (
						<div>
							<InfoCard
								icon={CheckCircle}
								label="Completed"
								variant="success"
								numberOfItems={completedCourses.length}
							/>

							<CoursesList
								size={dashboardSetting?.length === 1 ? 'sm' : 'lg'}
								items={completedCourses}
							/>
						</div>
					)}
			</div>

			<div className="pt-10 !mt-10 border-t-2 border-gray-200 dark:border-gray-700">
				<div className="pb-6 flex items-center gap-x-2">
					<IconBadge icon={LayoutDashboard} />

					<h2 className="text-xl">Recommended for you</h2>
				</div>

				{recommendedCourses && (
					<RecommendedCourses items={recommendedCourses} />
				)}
			</div>
		</div>
	);
};

export default Dashboard;
