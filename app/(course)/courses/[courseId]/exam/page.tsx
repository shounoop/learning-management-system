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

// const items = [
// 	{
// 		id: 'recents',
// 		label: 'Recents',
// 	},
// 	{
// 		id: 'home',
// 		label: 'Home',
// 	},
// 	{
// 		id: 'applications',
// 		label: 'Applications',
// 	},
// ] as const;

const FormSchema = z.object({
	items: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: 'You have to select at least one item.',
	}),
});

const ExamPage = ({ params }: { params: { courseId: string } }) => {
	// useState
	const [questions, setQuestions] = useState<QuestionWithAnswers[]>();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		// defaultValues: {
		// 	items: ['recents', 'home'],
		// },
	});

	// useEffect
	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get(
					`/api/courses/${params.courseId}/questions`
				);

				if (res.data) {
					setQuestions(res.data);
				}
			} catch (error) {
				console.log(error);
			}
		})();
	}, [params.courseId]);

	// function
	function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log(JSON.stringify(data, null, 2));
	}

	console.log('questions', questions);

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
								name="items"
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
													name="items"
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

						<Button type="submit">Submit</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default ExamPage;
