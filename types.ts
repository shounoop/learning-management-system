import { Course } from '@prisma/client';

interface RecommendCourse {
	id: string;
	courseId: string;
	categoryId: string;
	views: number;
	purchases: number;
	createdAt: Date;
	updatedAt: Date;
	course: Course;
}

export { type RecommendCourse };
