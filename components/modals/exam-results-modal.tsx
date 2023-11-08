'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { Chapter } from '@prisma/client';
import Link from 'next/link';

interface ExamResultsModalProps {
	chapters: Chapter[];
	exactRate: number;
	courseId: string;
	children?: React.ReactNode;
	onConfirm?: () => void;
}

const ExamResultsModal = ({
	chapters,
	courseId,
	exactRate,
	children,
	onConfirm,
}: ExamResultsModalProps) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Exam Results</AlertDialogTitle>

					<AlertDialogDescription>
						<div>
							<p
								className={cn(
									'text-lg font-semibold text-gray-800',
									exactRate >= 80 ? 'text-green-500' : 'text-red-500'
								)}
							>
								{`Results: ${Math.round(exactRate)}%`}
							</p>
						</div>

						{chapters?.length > 0 && (
							<div>
								<p className="mt-4 text-base font-semibold text-gray-800">
									Chapters you should re-study to consolidate your knowledge
									more firmly:
								</p>

								{chapters.map((chapter) => (
									<div key={chapter.id}>
										•{' '}
										<Link
											className="text-base font-medium text-blue-500 hover:underline"
											href={`/courses/${courseId}/chapters/${chapter.id}`}
										>
											{chapter.title}
										</Link>
									</div>
								))}
							</div>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>

					<AlertDialogAction onClick={onConfirm}>
						Re-study these chapters
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default ExamResultsModal;
