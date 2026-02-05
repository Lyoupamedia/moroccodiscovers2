import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User verification failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User verified:', user.id);

    // Parse request body
    const { siteId } = await req.json();
    if (!siteId) {
      return new Response(
        JSON.stringify({ error: 'Site ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Exporting MySQL data for site:', siteId);

    // Fetch site to get MySQL credentials
    const { data: site, error: siteError } = await supabase
      .from('cms_sites')
      .select('*')
      .eq('id', siteId)
      .single();

    if (siteError || !site) {
      console.error('Site not found:', siteError);
      return new Response(
        JSON.stringify({ error: 'Site not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if MySQL is connected
    if (!site.is_mysql_connected) {
      return new Response(
        JSON.stringify({ error: 'MySQL is not connected for this site' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has access to this site
    if (site.owner_id !== user.id) {
      const { data: membership } = await supabase
        .from('cms_site_members')
        .select('role')
        .eq('site_id', siteId)
        .eq('user_id', user.id)
        .single();

      if (!membership || !['owner', 'admin'].includes(membership.role)) {
        return new Response(
          JSON.stringify({ error: 'You do not have permission to export this site' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Check for MySQL proxy URL
    const mysqlProxyUrl = Deno.env.get('MYSQL_PROXY_URL');
    
    if (!mysqlProxyUrl) {
      // Return mock data if no proxy is configured
      console.log('No MYSQL_PROXY_URL configured, returning mock export data');
      
      const mockExport = {
        exportedAt: new Date().toISOString(),
        database: site.mysql_database,
        host: site.mysql_host,
        tables: [
          {
            name: 'wp_posts',
            rowCount: 42,
            columns: ['ID', 'post_author', 'post_date', 'post_content', 'post_title', 'post_status'],
            sampleData: [
              { ID: 1, post_title: 'Hello World', post_status: 'publish' },
              { ID: 2, post_title: 'Sample Page', post_status: 'publish' },
            ]
          },
          {
            name: 'wp_options',
            rowCount: 156,
            columns: ['option_id', 'option_name', 'option_value'],
            sampleData: [
              { option_id: 1, option_name: 'siteurl', option_value: 'https://example.com' },
              { option_id: 2, option_name: 'blogname', option_value: 'My Blog' },
            ]
          },
          {
            name: 'wp_users',
            rowCount: 3,
            columns: ['ID', 'user_login', 'user_email', 'display_name'],
            note: 'Sensitive data excluded from export'
          }
        ],
        note: 'This is sample data. Configure MYSQL_PROXY_URL for actual database export.'
      };

      return new Response(
        JSON.stringify(mockExport),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call the MySQL proxy to get export data
    console.log('Calling MySQL proxy for export...');
    
    const proxyResponse = await fetch(mysqlProxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'export',
        host: site.mysql_host,
        port: site.mysql_port,
        database: site.mysql_database,
        user: site.mysql_user,
        // Decrypt password (in production, use proper encryption)
        password: site.mysql_password_encrypted ? atob(site.mysql_password_encrypted) : '',
      }),
    });

    if (!proxyResponse.ok) {
      const errorText = await proxyResponse.text();
      console.error('MySQL proxy error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to export MySQL database', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const exportData = await proxyResponse.json();
    console.log('MySQL export successful');

    return new Response(
      JSON.stringify(exportData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
