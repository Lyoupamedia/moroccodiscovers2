import { CMSLayout } from '@/components/cms/CMSLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CMSMenus = () => {
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Navigation Menus</h1>
          <p className="text-muted-foreground mt-1">Create and manage your site navigation</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              The menu builder is being developed. You'll be able to create custom navigation menus with drag-and-drop functionality.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Features planned:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Drag-and-drop menu builder</li>
              <li>Multiple menu locations</li>
              <li>Nested menu items</li>
              <li>Link to pages, posts, or custom URLs</li>
              <li>Menu icons and styling options</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </CMSLayout>
  );
};

export default CMSMenus;
