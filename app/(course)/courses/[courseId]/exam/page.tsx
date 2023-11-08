'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { QuestionWithAnswers } from '@/app/api/courses/[courseId]/questions/route';
import ExamResultsModal from '@/components/modals/exam-results-modal';
import { Chapter } from '@prisma/client';
import { useRouter } from 'next/navigation';

const ExamPage = ({ params }: { params: { courseId: string } }) => {
	// useState
	const [questions, setQuestions] = useState<QuestionWithAnswers[]>();
	const [chapters, setChapters] = useState<Chapter[]>([]);
	const [exactRate, setExactRate] = useState(0);

	const router = useRouter();

	const FormSchema = z.object({
		items1: z.array(z.string()).refine((value) => value.some((item) => item), {
			message: 'You have to select at least one item.',
		}),
		items2: z.array(z.string()).refine((value) => value.some((item) => item), {
			message: 'You have to select at least one item.',
		}),
		items3: z.array(z.string()).refine((value) => value.some((item) => item), {
			message: 'You have to select at least one item.',
		}),
		items4: z.array(z.string()).refine((value) => value.some((item) => item), {
			message: 'You have to select at least one item.',
		}),
		items5: z.array(z.string()).refine((value) => value.some((item) => item), {
			message: 'You have to select at least one item.',
		}),
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			items1: [],
			items2: [],
			items3: [],
			items4: [],
			items5: [],
		},
	});

	// useEffect
	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get(
					`/api/courses/${params.courseId}/questions`
				);

				if (res.data) {
					const resQuestions = res.data as QuestionWithAnswers[];

					setQuestions(resQuestions);
				}
			} catch (error) {
				console.log(error);
			}
		})();
	}, [params.courseId]);

	// function
	function onSubmit(data: z.infer<typeof FormSchema>) {
		if (!questions) return;

		const answers = [
			data.items1.sort().reduce((acc, cur) => acc + cur, ''),
			data.items2.sort().reduce((acc, cur) => acc + cur, ''),
			data.items3.sort().reduce((acc, cur) => acc + cur, ''),
			data.items4.sort().reduce((acc, cur) => acc + cur, ''),
			data.items5.sort().reduce((acc, cur) => acc + cur, ''),
		];

		let newExactRate = 0;
		const needToLearnChapterIds: string[] = [];
		const newChapters: Chapter[] = [];

		questions.forEach((question, index) => {
			if (question.correctAnswer === answers[index]) {
				newExactRate += (1 / questions.length) * 100;
			} else {
				if (!needToLearnChapterIds.includes(question.chapterId)) {
					needToLearnChapterIds.push(question.chapterId);

					newChapters.push(question.chapter);
				}
			}
		});

		setChapters(
			newChapters.sort((a, b) => {
				const date1 = new Date(a.updatedAt);
				const date2 = new Date(b.updatedAt);

				return date2.getUTCMilliseconds() - date1.getUTCMilliseconds();
			})
		);
		setExactRate(newExactRate);

		(async () => {
			await axios.put(`/api/courses/${params.courseId}/exam`, {
				answers: JSON.stringify(answers),
				exactRate,
				isPerfect: exactRate === 100,
			});
		})();
	}

	const onConfirm = async () => {
		try {
			for (let chapter of chapters) {
				await axios.put(
					`/api/courses/${params.courseId}/chapters/${chapter.id}/progress`,
					{ isCompleted: false }
				);
			}

			if (chapters?.[0]) {
				router.push(`/courses/${params.courseId}/chapters/${chapters[0].id}`);
			}
		} catch (error) {
			console.log(
				'ERROR PUT /api/courses/[courseId]/chapters/[chapterId]/progress',
				error
			);
		}
	};

	return (
		<div className="flex flex-col max-w-4xl mx-auto pb-20">
			<div className="p-4">
				<div className="px-4 py-8">
					<h3 className="text-5xl text-center">Final Exam</h3>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						{questions?.map((question, index) => (
							<FormField
								key={question.id}
								control={form.control}
								name={
									`items${index + 1}` as
										| 'items1'
										| 'items2'
										| 'items3'
										| 'items4'
										| 'items5'
								}
								render={() => {
									const answers = question.answers ? [...question.answers] : [];

									const items = answers.map((answer) => ({
										id: answer.value,
										label: answer.label,
									}));

									return (
										<FormItem>
											<div className="mb-4">
												<FormLabel className="text-base">
													{`Question ${index + 1}: ${question.question}`}
												</FormLabel>
											</div>

											{items.map((item) => (
												<FormField
													key={item.id}
													control={form.control}
													name={
														`items${index + 1}` as
															| 'items1'
															| 'items2'
															| 'items3'
															| 'items4'
															| 'items5'
													}
													render={({ field }) => {
														return (
															<FormItem
																key={item.id}
																className="flex flex-row items-start space-x-3 space-y-0"
															>
																<FormControl>
																	<Checkbox
																		checked={field.value?.includes(item.id)}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([
																						...field.value,
																						item.id,
																				  ])
																				: field.onChange(
																						field.value?.filter(
																							(value) => value !== item.id
																						)
																				  );
																		}}
																	/>
																</FormControl>

																<FormLabel className="font-normal">
																	{item.label}
																</FormLabel>
															</FormItem>
														);
													}}
												/>
											))}
											<FormMessage />
										</FormItem>
									);
								}}
							/>
						))}

						<ExamResultsModal
							exactRate={exactRate}
							courseId={params.courseId}
							chapters={chapters}
							onConfirm={onConfirm}
						>
							<Button type="submit">Submit</Button>
						</ExamResultsModal>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default ExamPage;
