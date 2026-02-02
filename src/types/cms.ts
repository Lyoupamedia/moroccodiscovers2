export interface CMSSite {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  mysql_host: string | null;
  mysql_port: number;
  mysql_database: string | null;
  mysql_user: string | null;
  mysql_password_encrypted: string | null;
  is_mysql_connected: boolean;
  site_title: string | null;
  site_tagline: string | null;
  site_logo_url: string | null;
  site_favicon_url: string | null;
  theme: string;
  custom_css: string | null;
  created_at: string;
  updated_at: string;
}

export interface CMSPage {
  id: string;
  site_id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image_url: string | null;
  status: 'draft' | 'published' | 'scheduled' | 'trash';
  template: string;
  parent_id: string | null;
  menu_order: number;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CMSPost {
  id: string;
  site_id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image_url: string | null;
  status: 'draft' | 'published' | 'scheduled' | 'trash';
  categories: string[];
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  allow_comments: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CMSMedia {
  id: string;
  site_id: string;
  uploaded_by: string;
  filename: string;
  file_url: string;
  file_type: string;
  file_size: number | null;
  alt_text: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  created_at: string;
  updated_at: string;
}

export interface CMSSiteMember {
  id: string;
  site_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'editor' | 'author' | 'contributor';
  created_at: string;
}

export interface CMSMenu {
  id: string;
  site_id: string;
  name: string;
  location: string;
  items: CMSMenuItem[];
  created_at: string;
  updated_at: string;
}

export interface CMSMenuItem {
  id: string;
  label: string;
  url: string;
  type: 'page' | 'post' | 'custom' | 'category';
  target: '_self' | '_blank';
  children?: CMSMenuItem[];
}

export interface CMSSiteSetting {
  id: string;
  site_id: string;
  setting_key: string;
  setting_value: string | null;
  created_at: string;
  updated_at: string;
}
