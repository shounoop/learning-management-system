'use client';

import { Chapter } from '@prisma/client';
import { useEffect, useState } from 'react';
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult,
} from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import { Grip, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChaptersListProps {
	onEdit: (id: string) => void;
	onReorder: (updateData: { id: string; position: number }[]) => void;
	items: Chapter[];
}

export const ChaptersList = ({
	onEdit,
	onReorder,
	items,
}: ChaptersListProps) => {
	const [isMounted, setIsMounted] = useState(false);
	const [chapters, setChapters] = useState(items);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		setChapters(items);
	}, [items]);

	const onDragEnd = (result: DropResult) => {
		if (!result.destination) return;

		const items = Array.from(chapters);

		// remove the dragged item from the list and return it
		const [reorderedItem] = items.splice(result.source.index, 1);

		// add the dragged item to the list at the new position
		items.splice(result.destination.index, 0, reorderedItem);

		const startIndex = Math.min(result.source.index, result.destination.index);
		const endIndex = Math.max(result.source.index, result.destination.index);

		const updatedChapters = items.slice(startIndex, endIndex + 1);

		setChapters(items);

		const bulkUpdateData = updatedChapters.map((chapter) => ({
			id: chapter.id,
			position: items.findIndex((item) => item.id === chapter.id),
		}));

		onReorder(bulkUpdateData);
	};

	if (!isMounted) {
		return null;
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="chapters">
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{chapters.map((chapter, index) => (
							<Draggable
								key={chapter.id}
								draggableId={chapter.id}
								index={index}
							>
								{(provided) => (
									<div
										className={cn(
											'flex items-center gap-x-2 bg-slate-200 border-slate-200 border rounded-md text-slate-700 mb-4 text-sm',
											chapter.isPublished &&
												'bg-sky-100 border-sky-200 text-sky-700'
										)}
										{...provided.draggableProps}
										// {...provided.dragHandleProps}
										ref={provided.innerRef}
									>
										<div
											className={cn(
												'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition',
												chapter.isPublished &&
													'border-r-sky-200 hover:bg-sky-200'
											)}
											{...provided.dragHandleProps}
										>
											<Grip className="w-5 h-5" />
										</div>

										{chapter.title}

										<div className="ml-auto pr-2 flex items-center gap-x-2">
											{chapter.isFree && <Badge>Free</Badge>}

											<Badge
												className={cn(
													'bg-slate-500',
													chapter.isPublished && 'bg-sky-700'
												)}
											>
												{chapter.isPublished ? 'Published' : 'Draft'}
											</Badge>

											<Pencil
												onClick={() => onEdit(chapter.id)}
												className="w-4 h-4 cursor-pointer hover:opacity-75"
											/>
										</div>
									</div>
								)}
							</Draggable>
						))}

						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};
