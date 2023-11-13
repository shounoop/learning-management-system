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
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DASHBOARD_ITEM_ID } from '@/constants/dashboard-item-id';

const items = [
	{
		id: DASHBOARD_ITEM_ID.inProgress,
		label: 'In Progress',
	},
	{
		id: DASHBOARD_ITEM_ID.completed,
		label: 'Completed',
	},
] as const;

const FormSchema = z.object({
	items: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: 'You have to select at least one item.',
	}),
});

const DashboardForm = () => {
	const [isSaving, setIsSaving] = useState(false);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			items: [],
		},
	});

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		try {
			setIsSaving(true);

			const stringnifiedItems = JSON.stringify(data.items);

			await axios.put(`/api/personalization`, { dashboard: stringnifiedItems });

			toast.success('Dashboard updated successfully.');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong.');
		} finally {
			setIsSaving(false);
		}
	};

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get(`/api/personalization`);

				if (res?.data?.dashboard) {
					const parsed = JSON.parse(res.data.dashboard);

					form.setValue('items', parsed);
				}
			} catch (error) {
				console.log(error);
			}
		})();
	}, [form]);

	return (
		<div className="mt-6 border bg-slate-100 dark:bg-transparent rounded-md p-4">
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

					<Button disabled={isSaving} type="submit">
						Save
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default DashboardForm;
