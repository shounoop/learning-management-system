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
		id: 'in-progress',
		label: 'In Progress',
	},
	{
		id: 'completed',
		label: 'Completed',
	},
] as const;

const FormSchema = z.object({
	items: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: 'You have to select at least one item.',
	}),
});

const DashboardForm = () => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			items: ['in-progress', 'completed'],
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		// console.log(JSON.stringify(data));
		// console.log(JSON.stringify(data, null, 4));
		// console.log(data);

		const stringnified = JSON.stringify(data);
		console.log('stringnified', stringnified);

		const parsed = JSON.parse(stringnified);
		console.log('parsed', parsed);
	}

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="items"
						render={() => (
							<FormItem>
								<div className="mb-4">
									<FormLabel className="text-base">Dashboard</FormLabel>
									<FormDescription>
										Select the items you want to display in the dashboard.
									</FormDescription>
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

					<Button type="submit">Save</Button>
				</form>
			</Form>
		</div>
	);
};

export default DashboardForm;
