import { db } from '@/lib/db';
import Categories from './_components/categories';
import SearchInput from '@/components/search-input';

const SearchPage = async () => {
	const categories = await db.category.findMany({
		orderBy: {
			name: 'asc',
		},
	});

	return (
		<>
			<div className="px-6 pt-6 block md:hidden md:mb-0">
				<SearchInput />
			</div>

			<div className="p-6">
				<Categories items={categories} />
			</div>
		</>
	);
};

export default SearchPage;
