export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'bold' | 'minimal' | 'nature';
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  fonts: {
    heading: string;
    body: string;
  };
  preview: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Sahara Gold',
    description: 'Warm gold and terracotta tones inspired by Moroccan deserts',
    category: 'classic',
    colors: {
      light: {
        primary: '35 85% 55%',
        primaryForeground: '30 20% 98%',
        secondary: '25 35% 90%',
        secondaryForeground: '25 30% 15%',
        accent: '15 70% 45%',
        accentForeground: '30 20% 98%',
        background: '30 20% 98%',
        foreground: '25 30% 15%',
        card: '30 25% 97%',
        cardForeground: '25 30% 15%',
        muted: '30 15% 92%',
        mutedForeground: '25 15% 45%',
        border: '30 20% 88%',
      },
      dark: {
        primary: '42 87% 55%',
        primaryForeground: '25 30% 8%',
        secondary: '25 20% 20%',
        secondaryForeground: '30 20% 95%',
        accent: '15 70% 50%',
        accentForeground: '30 20% 98%',
        background: '25 30% 8%',
        foreground: '30 20% 95%',
        card: '25 25% 12%',
        cardForeground: '30 20% 95%',
        muted: '25 15% 18%',
        mutedForeground: '30 15% 60%',
        border: '25 20% 20%',
      },
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter',
    },
    preview: {
      primary: '#D4A017',
      secondary: '#E8DDD0',
      accent: '#B85C38',
      background: '#FAF7F2',
    },
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Cool blues and teals for a fresh, coastal feel',
    category: 'modern',
    colors: {
      light: {
        primary: '200 85% 45%',
        primaryForeground: '200 20% 98%',
        secondary: '195 35% 90%',
        secondaryForeground: '200 30% 15%',
        accent: '175 70% 40%',
        accentForeground: '200 20% 98%',
        background: '195 25% 98%',
        foreground: '200 30% 15%',
        card: '195 30% 97%',
        cardForeground: '200 30% 15%',
        muted: '195 15% 92%',
        mutedForeground: '200 15% 45%',
        border: '195 20% 88%',
      },
      dark: {
        primary: '200 85% 55%',
        primaryForeground: '200 30% 8%',
        secondary: '200 20% 20%',
        secondaryForeground: '195 20% 95%',
        accent: '175 70% 50%',
        accentForeground: '200 20% 98%',
        background: '200 35% 8%',
        foreground: '195 20% 95%',
        card: '200 30% 12%',
        cardForeground: '195 20% 95%',
        muted: '200 15% 18%',
        mutedForeground: '195 15% 60%',
        border: '200 20% 20%',
      },
    },
    fonts: {
      heading: 'Montserrat',
      body: 'Open Sans',
    },
    preview: {
      primary: '#1197B5',
      secondary: '#E0F0F5',
      accent: '#1ABC9C',
      background: '#F5FAFA',
    },
  },
  {
    id: 'forest-green',
    name: 'Forest Retreat',
    description: 'Deep greens and earthy browns for a natural aesthetic',
    category: 'nature',
    colors: {
      light: {
        primary: '145 60% 35%',
        primaryForeground: '145 20% 98%',
        secondary: '140 25% 90%',
        secondaryForeground: '145 30% 15%',
        accent: '35 55% 45%',
        accentForeground: '145 20% 98%',
        background: '140 15% 97%',
        foreground: '145 35% 12%',
        card: '140 20% 96%',
        cardForeground: '145 35% 12%',
        muted: '140 12% 91%',
        mutedForeground: '145 15% 45%',
        border: '140 15% 85%',
      },
      dark: {
        primary: '145 55% 45%',
        primaryForeground: '145 30% 8%',
        secondary: '145 20% 18%',
        secondaryForeground: '140 15% 95%',
        accent: '35 55% 50%',
        accentForeground: '145 20% 98%',
        background: '145 30% 7%',
        foreground: '140 15% 95%',
        card: '145 25% 10%',
        cardForeground: '140 15% 95%',
        muted: '145 15% 15%',
        mutedForeground: '140 12% 58%',
        border: '145 18% 18%',
      },
    },
    fonts: {
      heading: 'Merriweather',
      body: 'Source Sans Pro',
    },
    preview: {
      primary: '#2D8653',
      secondary: '#E5EFE8',
      accent: '#B8860B',
      background: '#F5F8F5',
    },
  },
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    description: 'Rich purples and deep indigos for a luxurious look',
    category: 'bold',
    colors: {
      light: {
        primary: '270 65% 50%',
        primaryForeground: '270 20% 98%',
        secondary: '265 30% 92%',
        secondaryForeground: '270 30% 15%',
        accent: '325 70% 50%',
        accentForeground: '270 20% 98%',
        background: '265 20% 98%',
        foreground: '270 35% 12%',
        card: '265 25% 97%',
        cardForeground: '270 35% 12%',
        muted: '265 15% 92%',
        mutedForeground: '270 15% 45%',
        border: '265 18% 88%',
      },
      dark: {
        primary: '270 65% 60%',
        primaryForeground: '270 30% 8%',
        secondary: '270 25% 18%',
        secondaryForeground: '265 18% 95%',
        accent: '325 70% 55%',
        accentForeground: '270 20% 98%',
        background: '270 35% 6%',
        foreground: '265 18% 95%',
        card: '270 28% 10%',
        cardForeground: '265 18% 95%',
        muted: '270 18% 15%',
        mutedForeground: '265 12% 58%',
        border: '270 20% 18%',
      },
    },
    fonts: {
      heading: 'Poppins',
      body: 'Nunito',
    },
    preview: {
      primary: '#8B5CF6',
      secondary: '#EDE9FE',
      accent: '#EC4899',
      background: '#FAF5FF',
    },
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    description: 'Elegant rose and soft pink tones for a sophisticated style',
    category: 'modern',
    colors: {
      light: {
        primary: '350 70% 60%',
        primaryForeground: '350 20% 98%',
        secondary: '345 40% 93%',
        secondaryForeground: '350 30% 15%',
        accent: '30 65% 55%',
        accentForeground: '350 20% 98%',
        background: '345 25% 98%',
        foreground: '350 30% 15%',
        card: '345 30% 97%',
        cardForeground: '350 30% 15%',
        muted: '345 18% 92%',
        mutedForeground: '350 15% 45%',
        border: '345 22% 88%',
      },
      dark: {
        primary: '350 70% 65%',
        primaryForeground: '350 30% 8%',
        secondary: '350 22% 18%',
        secondaryForeground: '345 18% 95%',
        accent: '30 65% 55%',
        accentForeground: '350 20% 98%',
        background: '350 32% 7%',
        foreground: '345 18% 95%',
        card: '350 25% 10%',
        cardForeground: '345 18% 95%',
        muted: '350 15% 15%',
        mutedForeground: '345 12% 58%',
        border: '350 18% 18%',
      },
    },
    fonts: {
      heading: 'Cormorant Garamond',
      body: 'Lato',
    },
    preview: {
      primary: '#E879A8',
      secondary: '#FCE7F3',
      accent: '#D4A017',
      background: '#FDF2F8',
    },
  },
  {
    id: 'slate-modern',
    name: 'Slate Modern',
    description: 'Clean grays and subtle blues for a professional look',
    category: 'minimal',
    colors: {
      light: {
        primary: '220 65% 50%',
        primaryForeground: '220 20% 98%',
        secondary: '215 25% 92%',
        secondaryForeground: '220 30% 15%',
        accent: '200 75% 50%',
        accentForeground: '220 20% 98%',
        background: '215 20% 98%',
        foreground: '220 30% 15%',
        card: '215 25% 97%',
        cardForeground: '220 30% 15%',
        muted: '215 15% 92%',
        mutedForeground: '220 12% 50%',
        border: '215 18% 88%',
      },
      dark: {
        primary: '220 65% 60%',
        primaryForeground: '220 30% 8%',
        secondary: '220 20% 18%',
        secondaryForeground: '215 15% 95%',
        accent: '200 75% 55%',
        accentForeground: '220 20% 98%',
        background: '220 30% 7%',
        foreground: '215 15% 95%',
        card: '220 25% 10%',
        cardForeground: '215 15% 95%',
        muted: '220 15% 15%',
        mutedForeground: '215 10% 58%',
        border: '220 18% 18%',
      },
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    preview: {
      primary: '#3B82F6',
      secondary: '#E2E8F0',
      accent: '#0EA5E9',
      background: '#F8FAFC',
    },
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Glow',
    description: 'Vibrant oranges and warm reds for an energetic vibe',
    category: 'bold',
    colors: {
      light: {
        primary: '25 90% 55%',
        primaryForeground: '25 20% 98%',
        secondary: '20 40% 92%',
        secondaryForeground: '25 35% 15%',
        accent: '350 75% 55%',
        accentForeground: '25 20% 98%',
        background: '20 25% 98%',
        foreground: '25 35% 12%',
        card: '20 30% 97%',
        cardForeground: '25 35% 12%',
        muted: '20 18% 92%',
        mutedForeground: '25 15% 45%',
        border: '20 22% 88%',
      },
      dark: {
        primary: '25 90% 58%',
        primaryForeground: '25 30% 8%',
        secondary: '25 22% 18%',
        secondaryForeground: '20 18% 95%',
        accent: '350 75% 58%',
        accentForeground: '25 20% 98%',
        background: '25 32% 7%',
        foreground: '20 18% 95%',
        card: '25 25% 10%',
        cardForeground: '20 18% 95%',
        muted: '25 15% 15%',
        mutedForeground: '20 12% 58%',
        border: '25 18% 18%',
      },
    },
    fonts: {
      heading: 'Raleway',
      body: 'Roboto',
    },
    preview: {
      primary: '#F97316',
      secondary: '#FED7AA',
      accent: '#EF4444',
      background: '#FFFBF5',
    },
  },
  {
    id: 'mono-elegant',
    name: 'Mono Elegant',
    description: 'Timeless black and white with subtle warmth',
    category: 'minimal',
    colors: {
      light: {
        primary: '0 0% 15%',
        primaryForeground: '0 0% 98%',
        secondary: '0 0% 95%',
        secondaryForeground: '0 0% 15%',
        accent: '45 80% 50%',
        accentForeground: '0 0% 15%',
        background: '0 0% 100%',
        foreground: '0 0% 10%',
        card: '0 0% 99%',
        cardForeground: '0 0% 10%',
        muted: '0 0% 96%',
        mutedForeground: '0 0% 45%',
        border: '0 0% 90%',
      },
      dark: {
        primary: '0 0% 95%',
        primaryForeground: '0 0% 10%',
        secondary: '0 0% 18%',
        secondaryForeground: '0 0% 95%',
        accent: '45 80% 55%',
        accentForeground: '0 0% 10%',
        background: '0 0% 5%',
        foreground: '0 0% 95%',
        card: '0 0% 8%',
        cardForeground: '0 0% 95%',
        muted: '0 0% 15%',
        mutedForeground: '0 0% 60%',
        border: '0 0% 18%',
      },
    },
    fonts: {
      heading: 'DM Serif Display',
      body: 'DM Sans',
    },
    preview: {
      primary: '#1A1A1A',
      secondary: '#F5F5F5',
      accent: '#D4A017',
      background: '#FFFFFF',
    },
  },
];

export const getThemeById = (id: string): Theme | undefined => {
  return themes.find((theme) => theme.id === id);
};

export const getThemesByCategory = (category: Theme['category']): Theme[] => {
  return themes.filter((theme) => theme.category === category);
};

export const themeCategories: { id: Theme['category']; label: string }[] = [
  { id: 'modern', label: 'Modern' },
  { id: 'classic', label: 'Classic' },
  { id: 'bold', label: 'Bold' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'nature', label: 'Nature' },
];
