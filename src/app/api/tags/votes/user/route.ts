import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/tags/votes/user - 获取用户对特定模组的投票记录
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('module_id');
    const sessionId = searchParams.get('session_id');

    if (!moduleId || !sessionId) {
      return NextResponse.json(
        { error: '缺少 module_id 或 session_id 参数' },
        { status: 400 }
      );
    }

    // 获取用户对该模组的投票记录
    const { data: votes, error } = await supabase
      .from('tag_votes')
      .select(`
        subcategory_id,
        created_at,
        tag_subcategories (
          id,
          name,
          description,
          tag_categories (
            id,
            name
          )
        )
      `)
      .eq('module_id', moduleId)
      .eq('session_id', sessionId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 如果没有投票记录，返回空数组
    if (!votes || votes.length === 0) {
      return NextResponse.json([]);
    }

    // 格式化返回数据
    const result = votes.map(vote => ({
      subcategory_id: vote.subcategory_id,
      subcategory: vote.tag_subcategories,
      created_at: vote.created_at
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}