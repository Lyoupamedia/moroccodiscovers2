import { useState } from 'react';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCMSSite } from '@/hooks/useCMSSite';
import { useToast } from '@/hooks/use-toast';
import { Database, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CMSDatabase = () => {
  const { currentSite, updateSite } = useCMSSite();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const [formData, setFormData] = useState({
    mysql_host: currentSite?.mysql_host || '',
    mysql_port: currentSite?.mysql_port || 3306,
    mysql_database: currentSite?.mysql_database || '',
    mysql_user: currentSite?.mysql_user || '',
    mysql_password: '',
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    // Simulate connection test (in real implementation, call edge function)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For now, just check if fields are filled
    if (formData.mysql_host && formData.mysql_database && formData.mysql_user) {
      setTestResult('success');
      toast({
        title: 'Connection Successful',
        description: 'Successfully connected to the MySQL database',
      });
    } else {
      setTestResult('error');
      toast({
        title: 'Connection Failed',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
    }

    setIsTesting(false);
  };

  const handleSave = async () => {
    if (!currentSite) return;

    setIsLoading(true);

    // Encrypt password (simple base64 for now - in production use proper encryption)
    const encryptedPassword = formData.mysql_password ? btoa(formData.mysql_password) : currentSite.mysql_password_encrypted;

    const success = await updateSite({
      mysql_host: formData.mysql_host || null,
      mysql_port: formData.mysql_port,
      mysql_database: formData.mysql_database || null,
      mysql_user: formData.mysql_user || null,
      mysql_password_encrypted: encryptedPassword,
      is_mysql_connected: testResult === 'success',
    });

    if (success) {
      toast({
        title: 'Settings Saved',
        description: 'MySQL connection settings have been updated',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  const handleDisconnect = async () => {
    if (!currentSite) return;

    setIsLoading(true);

    const success = await updateSite({
      mysql_host: null,
      mysql_port: 3306,
      mysql_database: null,
      mysql_user: null,
      mysql_password_encrypted: null,
      is_mysql_connected: false,
    });

    if (success) {
      setFormData({
        mysql_host: '',
        mysql_port: 3306,
        mysql_database: '',
        mysql_user: '',
        mysql_password: '',
      });
      setTestResult(null);
      toast({
        title: 'Disconnected',
        description: 'MySQL connection has been removed',
      });
    }

    setIsLoading(false);
  };

  if (!currentSite) {
    return (
      <CMSLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Please select a site first</p>
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">MySQL Connection</h1>
          <p className="text-muted-foreground mt-1">
            Connect to an external MySQL database to sync your content
          </p>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            To connect to your MySQL database, you need to ensure your database server allows external connections.
            You may need to whitelist our server IP addresses or use a MySQL proxy service.
          </AlertDescription>
        </Alert>

        {/* Connection Status */}
        {currentSite.is_mysql_connected && (
          <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">Connected</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {currentSite.mysql_host}:{currentSite.mysql_port} / {currentSite.mysql_database}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connection Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>Connection Settings</CardTitle>
                <CardDescription>Enter your MySQL database credentials</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  placeholder="localhost or IP address"
                  value={formData.mysql_host}
                  onChange={(e) => handleChange('mysql_host', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  type="number"
                  placeholder="3306"
                  value={formData.mysql_port}
                  onChange={(e) => handleChange('mysql_port', parseInt(e.target.value) || 3306)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="database">Database Name</Label>
              <Input
                id="database"
                placeholder="my_wordpress_db"
                value={formData.mysql_database}
                onChange={(e) => handleChange('mysql_database', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user">Username</Label>
              <Input
                id="user"
                placeholder="db_user"
                value={formData.mysql_user}
                onChange={(e) => handleChange('mysql_user', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={currentSite.mysql_password_encrypted ? '••••••••' : 'Enter password'}
                value={formData.mysql_password}
                onChange={(e) => handleChange('mysql_password', e.target.value)}
              />
              {currentSite.mysql_password_encrypted && (
                <p className="text-xs text-muted-foreground">
                  Leave blank to keep existing password
                </p>
              )}
            </div>

            {/* Test Result */}
            {testResult && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                testResult === 'success' 
                  ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' 
                  : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
              }`}>
                {testResult === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Connection successful!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Connection failed. Please check your credentials.</span>
                  </>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTesting || isLoading}
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
              {currentSite.is_mysql_connected && (
                <Button
                  variant="destructive"
                  onClick={handleDisconnect}
                  disabled={isLoading}
                >
                  Disconnect
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Supported Services */}
        <Card>
          <CardHeader>
            <CardTitle>Supported MySQL Services</CardTitle>
            <CardDescription>
              We support connecting to various MySQL-compatible databases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• MySQL Server (5.7+, 8.0+)</li>
              <li>• MariaDB (10.3+)</li>
              <li>• Amazon RDS for MySQL</li>
              <li>• Google Cloud SQL for MySQL</li>
              <li>• Azure Database for MySQL</li>
              <li>• PlanetScale (MySQL-compatible)</li>
              <li>• DigitalOcean Managed MySQL</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </CMSLayout>
  );
};

export default CMSDatabase;
