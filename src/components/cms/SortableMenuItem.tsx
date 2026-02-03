import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CMSMenuItem } from '@/types/cms';
import { cn } from '@/lib/utils';

interface SortableMenuItemProps {
  item: CMSMenuItem;
  depth?: number;
  onEdit: (item: CMSMenuItem) => void;
  onDelete: (itemId: string) => void;
}

export const SortableMenuItem = ({
  item,
  depth = 0,
  onEdit,
  onDelete,
}: SortableMenuItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const typeLabels: Record<CMSMenuItem['type'], string> = {
    page: 'Page',
    post: 'Post',
    custom: 'Custom',
    category: 'Category',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={cn(
          "flex items-center gap-2 p-3 bg-card border rounded-lg mb-2 transition-all",
          isDragging && "opacity-50 shadow-lg",
          depth > 0 && "ml-8 border-l-4 border-l-primary/30"
        )}
      >
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab hover:text-primary transition-colors"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{item.label}</span>
            {item.target === '_blank' && (
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-1.5 py-0.5 bg-muted rounded text-xs">
              {typeLabels[item.type]}
            </span>
            <span className="truncate">{item.url}</span>
          </div>
        </div>

        {item.children && item.children.length > 0 && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <ChevronRight className="w-4 h-4" />
            <span className="text-xs">{item.children.length}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Render children */}
      {item.children && item.children.length > 0 && (
        <div className="pl-4">
          {item.children.map((child) => (
            <SortableMenuItem
              key={child.id}
              item={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
