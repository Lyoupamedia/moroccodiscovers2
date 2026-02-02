import { CMSLayout } from '@/components/cms/CMSLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CMSUsers = () => {
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Team Members</h1>
          <p className="text-muted-foreground mt-1">Manage users who can access this site</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Team management is being developed. You'll be able to invite users with different roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Roles available:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li><strong>Owner</strong> - Full access, can delete site</li>
              <li><strong>Admin</strong> - Full access except site deletion</li>
              <li><strong>Editor</strong> - Can edit all content</li>
              <li><strong>Author</strong> - Can create and edit own posts</li>
              <li><strong>Contributor</strong> - Can create drafts only</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </CMSLayout>
  );
};

export default CMSUsers;
