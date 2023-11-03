import { Editor } from '@/components/editor';
import { Preview } from '@/components/preview';
import { Button } from '@/components/ui/button';
import { Note } from '@prisma/client';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
	data: Note;
	courseId: string;
	chapterId: string;
	setIsNeedRefresh: (value: boolean) => void;
}

const NoteItem = ({ data, courseId, chapterId, setIsNeedRefresh }: Props) => {
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [content, setContent] = useState(data.content);

	const router = useRouter();

	const toggleEdit = () => setIsEditing((prev) => !prev);

	const onSave = async () => {
		try {
			setIsSaving(true);

			const res = await axios.patch(
				`/api/courses/${courseId}/chapters/${chapterId}/notes`,
				{
					content,
					id: data.id,
				}
			);

			setContent(res.data.content);
			setIsEditing(false);

			toast.success('Note saved');
		} catch (error) {
			setContent(data.content);
			toast.error('Failed to save note');
		} finally {
			setIsSaving(false);
		}
	};

	const onDelete = async () => {
		try {
			setIsDeleting(true);

			await axios.delete(
				`/api/courses/${courseId}/chapters/${chapterId}/notes/${data.id}`
			);

			toast.success('Note deleted');
			setIsNeedRefresh(true);

			router.refresh();
		} catch (error) {
			toast.error('Failed to delete note');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div key={data.id} className="bg-gray-100 rounded-md mt-4 flex flex-col">
			<div className="px-4 pt-4 flex items-center justify-between">
				<p className="text-gray-500 mb-2">
					{moment(data.createdAt).format('DD-MM-YYYY HH:mm:ss')}
				</p>

				<div className="flex items-center space-x-2">
					{isEditing && (
						<Button onClick={onSave} size={'sm'} disabled={isSaving}>
							Save
						</Button>
					)}

					<Button variant={'ghost'} size={'sm'} onClick={toggleEdit}>
						{isEditing ? (
							<>Cancel</>
						) : (
							<>
								<Pencil className="h-4 w-4" />
							</>
						)}
					</Button>

					{!isEditing && (
						<Button
							onClick={onDelete}
							disabled={isDeleting}
							variant={'ghost'}
							size={'sm'}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>

			{isEditing ? (
				<div className="p-4">
					<Editor value={content} onChange={(value) => setContent(value)} />
				</div>
			) : (
				<Preview value={content} />
			)}
		</div>
	);
};

export default NoteItem;
