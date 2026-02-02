-- CMS Sites table - each site represents a WordPress-like installation
CREATE TABLE public.cms_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  mysql_host TEXT,
  mysql_port INTEGER DEFAULT 3306,
  mysql_database TEXT,
  mysql_user TEXT,
  mysql_password_encrypted TEXT,
  is_mysql_connected BOOLEAN DEFAULT false,
  site_title TEXT,
  site_tagline TEXT,
  site_logo_url TEXT,
  site_favicon_url TEXT,
  theme TEXT DEFAULT 'default',
  custom_css TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CMS Pages table
CREATE TABLE public.cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.cms_sites(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'trash')),
  template TEXT DEFAULT 'default',
  parent_id UUID REFERENCES public.cms_pages(id) ON DELETE SET NULL,
  menu_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(site_id, slug)
);

-- CMS Posts table
CREATE TABLE public.cms_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.cms_sites(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'trash')),
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  allow_comments BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(site_id, slug)
);

-- CMS Media library
CREATE TABLE public.cms_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.cms_sites(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  alt_text TEXT,
  caption TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CMS Site Members (users who can access a site with different roles)
CREATE TABLE public.cms_site_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.cms_sites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('owner', 'admin', 'editor', 'author', 'contributor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(site_id, user_id)
);

-- CMS Navigation menus
CREATE TABLE public.cms_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.cms_sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT DEFAULT 'primary',
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CMS Site Settings (key-value store for extensible settings)
CREATE TABLE public.cms_site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.cms_sites(id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(site_id, setting_key)
);

-- Enable RLS on all CMS tables
ALTER TABLE public.cms_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_site_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check site membership
CREATE OR REPLACE FUNCTION public.is_site_member(_user_id UUID, _site_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cms_site_members
    WHERE user_id = _user_id AND site_id = _site_id
  ) OR EXISTS (
    SELECT 1 FROM public.cms_sites
    WHERE id = _site_id AND owner_id = _user_id
  )
$$;

-- Helper function to check site admin/owner role
CREATE OR REPLACE FUNCTION public.is_site_admin(_user_id UUID, _site_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cms_site_members
    WHERE user_id = _user_id AND site_id = _site_id AND role IN ('owner', 'admin')
  ) OR EXISTS (
    SELECT 1 FROM public.cms_sites
    WHERE id = _site_id AND owner_id = _user_id
  )
$$;

-- RLS Policies for cms_sites
CREATE POLICY "Users can view their own sites"
  ON public.cms_sites FOR SELECT
  USING (owner_id = auth.uid() OR is_site_member(auth.uid(), id));

CREATE POLICY "Users can create sites"
  ON public.cms_sites FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Site owners can update their sites"
  ON public.cms_sites FOR UPDATE
  USING (owner_id = auth.uid() OR is_site_admin(auth.uid(), id));

CREATE POLICY "Site owners can delete their sites"
  ON public.cms_sites FOR DELETE
  USING (owner_id = auth.uid());

-- RLS Policies for cms_pages
CREATE POLICY "Site members can view pages"
  ON public.cms_pages FOR SELECT
  USING (is_site_member(auth.uid(), site_id));

CREATE POLICY "Site members can create pages"
  ON public.cms_pages FOR INSERT
  WITH CHECK (is_site_member(auth.uid(), site_id));

CREATE POLICY "Site members can update pages"
  ON public.cms_pages FOR UPDATE
  USING (is_site_member(auth.uid(), site_id));

CREATE POLICY "Site admins can delete pages"
  ON public.cms_pages FOR DELETE
  USING (is_site_admin(auth.uid(), site_id));

-- RLS Policies for cms_posts
CREATE POLICY "Site members can view posts"
  ON public.cms_posts FOR SELECT
  USING (is_site_member(auth.uid(), site_id));

CREATE POLICY "Site members can create posts"
  ON public.cms_posts FOR INSERT
  WITH CHECK (is_site_member(auth.uid(), site_id) AND author_id = auth.uid());

CREATE POLICY "Authors can update their posts"
  ON public.cms_posts FOR UPDATE
  USING (is_site_member(auth.uid(), site_id) AND (author_id = auth.uid() OR is_site_admin(auth.uid(), site_id)));

CREATE POLICY "Site admins can delete posts"
  ON public.cms_posts FOR DELETE
  USING (is_site_admin(auth.uid(), site_id));

-- RLS Policies for cms_media
CREATE POLICY "Site members can view media"
  ON public.cms_media FOR SELECT
  USING (is_site_member(auth.uid(), site_id));

CREATE POLICY "Site members can upload media"
  ON public.cms_media FOR INSERT
  WITH CHECK (is_site_member(auth.uid(), site_id) AND uploaded_by = auth.uid());

CREATE POLICY "Uploaders can update their media"
  ON public.cms_media FOR UPDATE
  USING (is_site_member(auth.uid(), site_id) AND (uploaded_by = auth.uid() OR is_site_admin(auth.uid(), site_id)));

CREATE POLICY "Site admins can delete media"
  ON public.cms_media FOR DELETE
  USING (is_site_admin(auth.uid(), site_id));

-- RLS Policies for cms_site_members
CREATE POLICY "Site admins can view members"
  ON public.cms_site_members FOR SELECT
  USING (is_site_member(auth.uid(), site_id));

CREATE POLICY "Site admins can add members"
  ON public.cms_site_members FOR INSERT
  WITH CHECK (is_site_admin(auth.uid(), site_id));

CREATE POLICY "Site admins can update members"
  ON public.cms_site_members FOR UPDATE
  USING (is_site_admin(auth.uid(), site_id));

CREATE POLICY "Site admins can remove members"
  ON public.cms_site_members FOR DELETE
  USING (is_site_admin(auth.uid(), site_id));

-- RLS Policies for cms_menus
CREATE POLICY "Site members can view menus"
  ON public.cms_menus FOR SELECT
  USING (is_site_member(auth.uid(), site_id));

CREATE POLICY "Site admins can manage menus"
  ON public.cms_menus FOR ALL
  USING (is_site_admin(auth.uid(), site_id));

-- RLS Policies for cms_site_settings
CREATE POLICY "Site members can view settings"
  ON public.cms_site_settings FOR SELECT
  USING (is_site_member(auth.uid(), site_id));

CREATE POLICY "Site admins can manage settings"
  ON public.cms_site_settings FOR ALL
  USING (is_site_admin(auth.uid(), site_id));

-- Updated_at triggers for all tables
CREATE TRIGGER update_cms_sites_updated_at
  BEFORE UPDATE ON public.cms_sites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_pages_updated_at
  BEFORE UPDATE ON public.cms_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_posts_updated_at
  BEFORE UPDATE ON public.cms_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_media_updated_at
  BEFORE UPDATE ON public.cms_media
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_menus_updated_at
  BEFORE UPDATE ON public.cms_menus
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_site_settings_updated_at
  BEFORE UPDATE ON public.cms_site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();