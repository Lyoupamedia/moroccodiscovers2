import { CMSLayout } from '@/components/cms/CMSLayout';
import { MenuBuilder } from '@/components/cms/MenuBuilder';

const CMSMenus = () => {
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Navigation Menus</h1>
          <p className="text-muted-foreground mt-1">Create and manage your site navigation</p>
        </div>

        <MenuBuilder />
      </div>
    </CMSLayout>
  );
};

export default CMSMenus;
