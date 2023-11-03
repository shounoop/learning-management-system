'use client';

import AddNoteModal from '@/components/modals/add-note-modal';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Note } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import NoteItem from './note-item';

interface Props {
	courseId: string;
	chapterId: string;
	userId: string;
}

const Notes = ({ courseId, chapterId, userId }: Props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [content, setContent] = useState('');
	const [notes, setNotes] = useState<Note[]>();
	const [isNeedRefresh, setIsNeedRefresh] = useState(false);

	const onAdd = async () => {
		try {
			setIsLoading(true);

			await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/notes`, {
				content,
			});

			setIsNeedRefresh(true);

			toast.success('Note added');
		} catch (error) {
			toast.error('Something went wrong, please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get(
					`/api/courses/${courseId}/chapters/${chapterId}/notes`
				);

				setNotes(res.data);
			} catch (error) {
				console.log(error);
			} finally {
				setIsNeedRefresh(false);
			}
		})();
	}, [chapterId, courseId, isNeedRefresh]);

	return (
		<div className="mt-14">
			<Separator />

			<div className="p-4 flex flex-col md:flex-row items-center justify-between">
				<h2 className="text-2xl font-semibold mb-2">Your notes</h2>

				<AddNoteModal onAdd={onAdd} content={content} setContent={setContent}>
					<Button size={'sm'} disabled={isLoading}>
						Add new note
					</Button>
				</AddNoteModal>
			</div>

			<div className="p-4">
				{!notes?.length && (
					<p className="text-gray-500">{`You don't have any notes yet.`}</p>
				)}

				{!!notes?.length &&
					notes.map((note) => (
						<NoteItem
							setIsNeedRefresh={setIsNeedRefresh}
							key={note.id}
							data={note}
							courseId={courseId}
							chapterId={chapterId}
						/>
					))}
			</div>
		</div>
	);
};

export default Notes;
