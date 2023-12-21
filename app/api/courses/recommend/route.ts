import { db } from '@/lib/db';
import { RecommendCourse } from '@/types';
import { auth } from '@clerk/nextjs';
import { Course, CourseStatistic, Purchase } from '@prisma/client';
import { NextResponse } from 'next/server';

interface QuantityByCategory {
	[key: string]: number;
}

const getCategoryWithLargestQuantity = (
	quantityByCategory: QuantityByCategory
) => {
	const categoryIds = Object.keys(quantityByCategory);

	const largestQuantity = Math.max(...Object.values(quantityByCategory));

	const largestQuantityCategoryId = categoryIds.find(
		(categoryId) => quantityByCategory[categoryId] === largestQuantity
	);

	return largestQuantityCategoryId;
};

const getQuantityByCategory = (courses: Course[]) => {
	return courses.reduce((acc: QuantityByCategory, course) => {
		const { categoryId } = course;

		if (categoryId && !acc[categoryId as keyof QuantityByCategory])
			acc[categoryId as keyof QuantityByCategory] = 0;

		acc[categoryId as keyof QuantityByCategory]++;

		return acc;
	}, {});
};

const getRecommendedCourses = (
	categoryId: string,
	courseStatistics: (CourseStatistic & { course: Course })[],
	purchasedCourses: { course: Course }[]
): RecommendCourse[] => {
	const coursesWithViews = courseStatistics
		.filter((courseStatistic) => courseStatistic.categoryId === categoryId)
		.map((courseStatistic) => {
			return { ...courseStatistic };
		});

	const unPurchasedCourses = coursesWithViews.filter((courseWithView) => {
		return !purchasedCourses.find(
			(purchasedCourse) => purchasedCourse.course.id === courseWithView.courseId
		);
	});

	const sortedCoursesWithViews = unPurchasedCourses.sort((a, b) => {
		if (a.purchases === b.purchases) {
			return b.views - a.views;
		}

		return b.purchases - a.purchases;
	});

	const top4CoursesWithViews = sortedCoursesWithViews.slice(0, 4);
	return top4CoursesWithViews;
};

const GET = async (req: Request) => {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const purchasedCourses = await db.purchase.findMany({
			where: { userId },
			select: { course: true },
		});

		const quantityByCategory = getQuantityByCategory(
			purchasedCourses.map((purchasedCourse) => purchasedCourse.course)
		);
		const largestQuantityCategoryId =
			getCategoryWithLargestQuantity(quantityByCategory);

		const courseStatistics = await db.courseStatistic.findMany({
			include: {
				course: true,
			},
		});

		const recommendCourses: RecommendCourse[] = getRecommendedCourses(
			largestQuantityCategoryId!,
			courseStatistics,
			purchasedCourses
		);

		return NextResponse.json(recommendCourses);
	} catch (error) {
		console.log('[ERROR] GET /api/courses/recommend', error);
		return new NextResponse('Internal server error', { status: 500 });
	}
};

export { GET };
