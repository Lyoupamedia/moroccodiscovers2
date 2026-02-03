import { useState } from 'react';
import { themes, themeCategories, type Theme } from '@/config/themes';
import { ThemeCard } from './ThemeCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ThemeSelectorProps {
  selectedTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export const ThemeSelector = ({ selectedTheme, onSelectTheme }: ThemeSelectorProps) => {
  const [activeCategory, setActiveCategory] = useState<Theme['category'] | 'all'>('all');

  const filteredThemes = activeCategory === 'all'
    ? themes
    : themes.filter((theme) => theme.category === activeCategory);

  return (
    <div className="space-y-4">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          className={cn(
            'cursor-pointer transition-colors',
            activeCategory === 'all' ? '' : 'hover:bg-secondary'
          )}
          onClick={() => setActiveCategory('all')}
        >
          All
        </Badge>
        {themeCategories.map((category) => (
          <Badge
            key={category.id}
            variant={activeCategory === category.id ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-colors',
              activeCategory === category.id ? '' : 'hover:bg-secondary'
            )}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </Badge>
        ))}
      </div>

      {/* Theme grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredThemes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isSelected={selectedTheme === theme.id}
            onSelect={onSelectTheme}
          />
        ))}
      </div>

      {filteredThemes.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          No themes found in this category
        </div>
      )}
    </div>
  );
};
