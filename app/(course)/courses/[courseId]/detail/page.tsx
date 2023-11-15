import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const Detail = async ({ params }: { params: { courseId: string } }) => {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}

	const course = await db.course.findUnique({
		where: {
			id: params.courseId,
		},
		include: {
			chapters: {
				where: { isPublished: true },
				include: { userProgresses: { where: { userId } } },
				orderBy: { position: 'asc' },
			},
		},
	});

	return (
		<div className="p-8">
			<div
				className="grid grid-cols-1 sm:grid-cols-2 gap-4 center-content
			"
			>
				<div>
					<div className="text-2xl font-semibold">{course?.title}</div>

					<div>{course?.description}</div>
				</div>

				<div>
					<Image
						src={`https://images.unsplash.com/photo-1693328604570-ade5a23ce2cd?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
						alt="course-image"
						width={500}
						height={500}
					/>

					<div>
						<div>4.9</div>
						<div>{`(105 đánh giá)`}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Detail;
