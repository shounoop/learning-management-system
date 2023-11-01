'use client';

import AddNoteModal from '@/components/modals/add-note-modal';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

const Notes = () => {
	const [isLoading, setIsLoading] = useState(false);

	const onDelete = async () => {};

	return (
		<div className="mt-6">
			<Separator />

			<div className="p-4 flex flex-col md:flex-row items-center justify-between">
				<h2 className="text-2xl font-semibold mb-2">Your notes</h2>

				<AddNoteModal onConfirm={onDelete}>
					<Button size={'sm'} disabled={isLoading}>
						Add new note
					</Button>
				</AddNoteModal>
			</div>

			<div className="p-4">
				<p className="text-gray-500">{`You don't have any notes yet.`}</p>
			</div>
		</div>
	);
};

export default Notes;
