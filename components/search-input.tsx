'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';

const SearchInput = () => {
	const [value, setValue] = useState('');

	const debouncedValue = useDebounce(value, 500);

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const currentCategoryId = searchParams.get('categoryId');

	useEffect(() => {
		const url = qs.stringifyUrl(
			{
				url: pathname,
				query: {
					categoryId: currentCategoryId,
					title: debouncedValue,
				},
			},
			{
				skipEmptyString: true,
				skipNull: true,
			}
		);

		router.push(url);
	}, [debouncedValue, currentCategoryId, pathname, router]);

	return (
		<div className="relative">
			<Search className="w-4 h-4 absolute top-3 left-3 text-slate-600" />

			<Input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className="w-full md:w[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
				placeholder="Search for a course"
			/>
		</div>
	);
};

export default SearchInput;
