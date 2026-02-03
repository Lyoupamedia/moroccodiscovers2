import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Theme } from '@/config/themes';

interface ThemeCardProps {
  theme: Theme;
  isSelected: boolean;
  onSelect: (themeId: string) => void;
}

export const ThemeCard = ({ theme, isSelected, onSelect }: ThemeCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(theme.id)}
      className={cn(
        'group relative flex flex-col rounded-lg border-2 p-3 text-left transition-all hover:shadow-md',
        isSelected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-border hover:border-primary/50'
      )}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          <Check className="h-4 w-4" />
        </div>
      )}

      {/* Theme preview */}
      <div
        className="mb-3 flex h-24 w-full overflow-hidden rounded-md"
        style={{ backgroundColor: theme.preview.background }}
      >
        {/* Left sidebar simulation */}
        <div
          className="flex w-12 flex-shrink-0 flex-col gap-1.5 p-2"
          style={{ backgroundColor: theme.preview.secondary }}
        >
          <div
            className="h-2 w-full rounded-sm"
            style={{ backgroundColor: theme.preview.primary }}
          />
          <div
            className="h-2 w-3/4 rounded-sm opacity-50"
            style={{ backgroundColor: theme.preview.primary }}
          />
          <div
            className="h-2 w-3/4 rounded-sm opacity-50"
            style={{ backgroundColor: theme.preview.primary }}
          />
          <div
            className="mt-auto h-2 w-full rounded-sm"
            style={{ backgroundColor: theme.preview.accent }}
          />
        </div>

        {/* Main content simulation */}
        <div className="flex flex-1 flex-col gap-2 p-2">
          {/* Header bar */}
          <div className="flex items-center justify-between">
            <div
              className="h-2.5 w-16 rounded-sm"
              style={{ backgroundColor: theme.preview.primary }}
            />
            <div
              className="h-4 w-10 rounded"
              style={{ backgroundColor: theme.preview.accent }}
            />
          </div>

          {/* Content cards */}
          <div className="flex flex-1 gap-1.5">
            <div
              className="flex-1 rounded"
              style={{ backgroundColor: theme.preview.secondary }}
            />
            <div
              className="flex-1 rounded"
              style={{ backgroundColor: theme.preview.secondary }}
            />
            <div
              className="flex-1 rounded"
              style={{ backgroundColor: theme.preview.secondary }}
            />
          </div>

          {/* Bottom bar */}
          <div className="flex gap-1">
            <div
              className="h-1.5 w-8 rounded-sm opacity-60"
              style={{ backgroundColor: theme.preview.primary }}
            />
            <div
              className="h-1.5 w-12 rounded-sm opacity-40"
              style={{ backgroundColor: theme.preview.primary }}
            />
          </div>
        </div>
      </div>

      {/* Theme info */}
      <div className="flex-1">
        <h4 className="font-medium text-foreground">{theme.name}</h4>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
          {theme.description}
        </p>
      </div>

      {/* Color swatches */}
      <div className="mt-2 flex gap-1">
        <div
          className="h-4 w-4 rounded-full ring-1 ring-border"
          style={{ backgroundColor: theme.preview.primary }}
          title="Primary"
        />
        <div
          className="h-4 w-4 rounded-full ring-1 ring-border"
          style={{ backgroundColor: theme.preview.secondary }}
          title="Secondary"
        />
        <div
          className="h-4 w-4 rounded-full ring-1 ring-border"
          style={{ backgroundColor: theme.preview.accent }}
          title="Accent"
        />
        <div
          className="h-4 w-4 rounded-full ring-1 ring-border"
          style={{ backgroundColor: theme.preview.background }}
          title="Background"
        />
      </div>
    </button>
  );
};
