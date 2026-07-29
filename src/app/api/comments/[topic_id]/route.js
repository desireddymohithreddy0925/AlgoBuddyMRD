import { cookies } from 'next/headers';
import { getSupabaseServerClient } from '@/lib/serverApi';

function stripHtml(str) {
  return str.replace(/<[^>]*>/g, '');
}

export async function GET(req, { params }) {
  const { topic_id } = await params;
  const cookieStore = await cookies();
  const supabase = getSupabaseServerClient(cookieStore);
  
  const { data: comments, error } = await supabase
    .from('topic_comments')
    .select(`
      *,
      user_profiles ( full_name, avatar_url )
    `)
    .eq('topic_id', topic_id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("[/api/comments GET] Supabase error:", error.message);
    return Response.json({ comments: [] });
  }

  return Response.json({ comments: comments || [] });
}
