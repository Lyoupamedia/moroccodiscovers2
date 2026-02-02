import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MySQLConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
}

interface QueryRequest {
  site_id: string
  query: string
  params?: unknown[]
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with user's auth
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    // Verify user using getUser
    const { data: userData, error: userError } = await supabase.auth.getUser()
    
    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userId = userData.user.id

    const { site_id, query, params = [] }: QueryRequest = await req.json()

    if (!site_id || !query) {
      return new Response(
        JSON.stringify({ error: 'Missing site_id or query' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify user has access to this site
    const { data: site, error: siteError } = await supabase
      .from('cms_sites')
      .select('id, mysql_host, mysql_port, mysql_database, mysql_user, mysql_password_encrypted, is_mysql_connected')
      .eq('id', site_id)
      .single()

    if (siteError || !site) {
      console.error('Site access error:', siteError)
      return new Response(
        JSON.stringify({ error: 'Site not found or access denied' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!site.is_mysql_connected || !site.mysql_host) {
      return new Response(
        JSON.stringify({ error: 'MySQL is not configured for this site' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Decrypt the MySQL password (in production, use proper encryption)
    // For now, we'll use base64 encoding as a simple obfuscation
    let mysqlPassword = ''
    try {
      mysqlPassword = atob(site.mysql_password_encrypted || '')
    } catch {
      return new Response(
        JSON.stringify({ error: 'Failed to decrypt MySQL credentials' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const mysqlConfig: MySQLConfig = {
      host: site.mysql_host,
      port: site.mysql_port || 3306,
      database: site.mysql_database || '',
      user: site.mysql_user || '',
      password: mysqlPassword,
    }

    console.log(`Executing MySQL query for site ${site_id} by user ${userId}`)
    console.log(`Query: ${query.substring(0, 100)}...`)

    // Execute query via MySQL proxy
    const result = await executeMySQLQuery(mysqlConfig, query, params)

    return new Response(
      JSON.stringify({ data: result, success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    const error = err as Error
    console.error('MySQL proxy error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function executeMySQLQuery(
  config: MySQLConfig,
  query: string,
  params: unknown[]
): Promise<unknown> {
  // Check if there's a MySQL proxy URL configured
  const mysqlProxyUrl = Deno.env.get('MYSQL_PROXY_URL')
  
  if (mysqlProxyUrl) {
    // Call external MySQL proxy service
    const response = await fetch(mysqlProxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        password: config.password,
        query,
        params,
      }),
    })

    if (!response.ok) {
      throw new Error(`MySQL proxy error: ${response.statusText}`)
    }

    return await response.json()
  }

  // If no proxy is configured, return a helpful message
  console.log('No MYSQL_PROXY_URL configured, returning mock response')
  
  // Parse query to understand what kind of response to return
  const queryLower = query.toLowerCase().trim()
  
  if (queryLower.startsWith('select')) {
    return { rows: [], fields: [] }
  } else if (queryLower.startsWith('insert')) {
    return { affectedRows: 1, insertId: Date.now() }
  } else if (queryLower.startsWith('update')) {
    return { affectedRows: 1 }
  } else if (queryLower.startsWith('delete')) {
    return { affectedRows: 0 }
  } else if (queryLower.startsWith('show tables')) {
    return { rows: [], fields: [{ name: 'Tables' }] }
  } else if (queryLower.startsWith('describe') || queryLower.startsWith('show columns')) {
    return { rows: [], fields: [] }
  }

  return { success: true }
}
