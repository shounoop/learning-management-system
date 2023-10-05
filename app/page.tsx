import { Button } from '@/components/ui/button';

export default function Home() {
	console.log(12321);
	return (
		<div className="p-4">
			<p className="text-3xl">Hello!</p>

			<Button variant={'destructive'} size={'sm'}>
				Register
			</Button>
		</div>
	);
}
