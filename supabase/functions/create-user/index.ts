import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { email, password, real_name, phone, role } = await req.json();

    if (!email || !password || !role) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if caller is admin (except for initial setup)
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user: caller } } = await supabase.auth.getUser(token);
      if (caller) {
        // Verify caller is admin
        const { data: callerRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', caller.id)
          .eq('role', 'admin');
        if (!callerRoles || callerRoles.length === 0) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
    } else {
      // No auth header - only allow if no users exist (initial setup)
      const { count } = await supabase.from('user_roles').select('*', { count: 'exact', head: true });
      if (count && count > 0) {
        return new Response(JSON.stringify({ error: 'Unauthorized - admin already exists' }), {
          status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Create user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { real_name, phone },
    });

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const userId = authData.user.id;

    // Update profile
    await supabase.from('profiles').update({
      phone: phone || '',
      real_name: real_name || '',
    }).eq('user_id', userId);

    // Assign role
    await supabase.from('user_roles').insert({
      user_id: userId,
      role: role,
    });

    return new Response(JSON.stringify({ success: true, userId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
