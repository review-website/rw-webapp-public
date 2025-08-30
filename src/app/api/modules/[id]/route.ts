import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/modules/[id] - 获取单个模组详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: '模组不存在' }, { status: 404 });
    }

    // 获取该模组的投票统计
    const { data: voteStats, error: voteError } = await supabase
      .from('tag_votes')
      .select(`
        subcategory_id,
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
      .eq('module_id', params.id);

    if (voteError) {
      console.error('Vote stats error:', voteError);
    }

    const moduleWithStats = {
      ...data,
      vote_statistics: voteStats || []
    };

    return NextResponse.json(moduleWithStats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}