import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { useState } from 'react';
import { Editor } from '@/components/editor';

interface AddNoteModalProps {
	children: React.ReactNode;
	content: string;
	setContent: (content: string) => void;
	onAdd: () => void;
}

const AddNoteModal = ({
	children,
	content,
	setContent,
	onAdd,
}: AddNoteModalProps) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Add new note</AlertDialogTitle>
				</AlertDialogHeader>

				<div className="mt-6 border bg-slate-100 rounded-md p-4">
					<div className="font-medium flex items-center justify-between">
						Your note
					</div>

					<div className="pt-4">
						<Editor value={content} onChange={(value) => setContent(value)} />
					</div>
				</div>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>

					<AlertDialogAction onClick={onAdd}>Add new note</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default AddNoteModal;
