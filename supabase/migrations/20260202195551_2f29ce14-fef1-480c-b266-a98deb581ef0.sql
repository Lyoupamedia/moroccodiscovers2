-- Fix permissive RLS policies for cms_menus (replace FOR ALL with specific operations)
DROP POLICY IF EXISTS "Site admins can manage menus" ON public.cms_menus;

CREATE POLICY "Site admins can insert menus"
  ON public.cms_menus FOR INSERT
  WITH CHECK (is_site_admin(auth.uid(), site_id));

CREATE POLICY "Site admins can update menus"
  ON public.cms_menus FOR UPDATE
  USING (is_site_admin(auth.uid(), site_id));

CREATE POLICY "Site admins can delete menus"
  ON public.cms_menus FOR DELETE
  USING (is_site_admin(auth.uid(), site_id));

-- Fix permissive RLS policies for cms_site_settings (replace FOR ALL with specific operations)
DROP POLICY IF EXISTS "Site admins can manage settings" ON public.cms_site_settings;

CREATE POLICY "Site admins can insert settings"
  ON public.cms_site_settings FOR INSERT
  WITH CHECK (is_site_admin(auth.uid(), site_id));

CREATE POLICY "Site admins can update settings"
  ON public.cms_site_settings FOR UPDATE
  USING (is_site_admin(auth.uid(), site_id));

CREATE POLICY "Site admins can delete settings"
  ON public.cms_site_settings FOR DELETE
  USING (is_site_admin(auth.uid(), site_id));