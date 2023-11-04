'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

const items = [
	{
		id: 'recents',
		label: 'Recents',
	},
	{
		id: 'home',
		label: 'Home',
	},
	{
		id: 'applications',
		label: 'Applications',
	},
	{
		id: 'desktop',
		label: 'Desktop',
	},
	{
		id: 'downloads',
		label: 'Downloads',
	},
	{
		id: 'documents',
		label: 'Documents',
	},
] as const;

const FormSchema = z.object({
	items: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: 'You have to select at least one item.',
	}),
});

const ExamPage = () => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			items: ['recents', 'home'],
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log(JSON.stringify(data, null, 2));
	}

	return (
		<div className="flex flex-col max-w-4xl mx-auto pb-20">
			<div className="p-4">
				<div className="px-4 py-8">
					<h3 className="text-5xl text-center">Final Test</h3>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="items"
							render={() => (
								<FormItem>
									<div className="mb-4">
										<FormLabel className="text-base">
											Question 1: Select the items you want to display in the
											sidebar.
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
																		? field.onChange([...field.value, item.id])
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
							)}
						/>

						<Button type="submit">Submit</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default ExamPage;
