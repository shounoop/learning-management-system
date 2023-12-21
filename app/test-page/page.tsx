import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { Course, CourseStatistic } from '@prisma/client';
import { redirect } from 'next/navigation';

const TestPage = async () => {
	const { userId } = auth();

	if (!userId) return redirect('/');

	const purchasedCourses = await db.purchase.findMany({
		where: { userId },
		select: { course: true },
	});

	const quantityByCategory: {
		[key: string]: number;
	} = purchasedCourses.reduce(
		(
			acc: {
				[key: string]: number;
			},
			{ course }
		) => {
			const { categoryId } = course;

			if (categoryId && !acc[categoryId as keyof {}])
				acc[categoryId as keyof {}] = 0;

			acc[categoryId as keyof {}]++;

			return acc;
		},
		{}
	);

	const getCategoryWithLargestQuantity = () => {
		const categoryIds = Object.keys(quantityByCategory);

		const largestQuantity = Math.max(...Object.values(quantityByCategory));

		const largestQuantityCategoryId = categoryIds.find(
			(categoryId) => quantityByCategory[categoryId] === largestQuantity
		);

		return largestQuantityCategoryId;
	};

	const get4CoursesWithMostViews = (
		categoryId: string,
		courseStatistics: (CourseStatistic & { course: Course })[]
	): CourseStatistic[] => {
		const coursesWithViews = courseStatistics
			.filter((courseStatistic) => courseStatistic.categoryId === categoryId)
			.map((courseStatistic) => {
				return { ...courseStatistic };
			});

		const unPurchasedCourses = coursesWithViews.filter((courseWithView) => {
			return !purchasedCourses.find(
				(purchasedCourse) =>
					purchasedCourse.course.id === courseWithView.courseId
			);
		});

		const sortedCoursesWithViews = unPurchasedCourses.sort(
			(a, b) => b.views - a.views
		);

		const top4CoursesWithViews = sortedCoursesWithViews.slice(0, 4);
		return top4CoursesWithViews;
	};

	const courseStatistics = await db.courseStatistic.findMany({
		include: {
			course: true,
		},
	});

	const fourCoursesWithMostViews = get4CoursesWithMostViews(
		getCategoryWithLargestQuantity()!,
		courseStatistics
	);

	console.log('***', fourCoursesWithMostViews);

	return <div>Test Page</div>;
};

export default TestPage;
