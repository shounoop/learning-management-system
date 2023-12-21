import { RecommendCourse } from '@/types';
import RecommendedCourseCard from './recommended-course-card';

interface RecommendedCoursesProps {
	items: RecommendCourse[];
}

const RecommendedCourses = ({ items }: RecommendedCoursesProps) => {
	return (
		<div>
			<div
				className={
					'grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4'
				}
			>
				{items.map((item) => (
					<RecommendedCourseCard
						key={item.id}
						id={item.id}
						title={item.course.title}
						imageUrl={item.course.imageUrl!}
						price={item.course.price!}
						views={item.views}
						purchases={item.purchases}
					/>
				))}
			</div>

			{items.length === 0 && (
				<div className="text-center text-sm text-muted-foreground mt-10">
					No courses found
				</div>
			)}
		</div>
	);
};

export default RecommendedCourses;
