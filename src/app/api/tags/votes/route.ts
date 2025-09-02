import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/tags/votes - 提交标签投票
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { module_id, subcategory_ids, session_id } = body;

    if (!module_id || !subcategory_ids || !Array.isArray(subcategory_ids) || !session_id) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 检查是否已经投过票
    const { data: existingVotes, error: checkError } = await supabase
      .from('tag_votes')
      .select('subcategory_id')
      .eq('module_id', module_id)
      .eq('session_id', session_id);

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    // 找出新的投票（避免重复投票）
    const existingSubcategoryIds = existingVotes?.map(v => v.subcategory_id) || [];
    const newVotes = subcategory_ids
      .filter(id => !existingSubcategoryIds.includes(id))
      .map(subcategory_id => ({
        module_id,
        subcategory_id,
        session_id
      }));

    if (newVotes.length === 0) {
      return NextResponse.json({ message: '没有新的投票需要提交' });
    }

    const { data, error } = await supabase
      .from('tag_votes')
      .insert(newVotes)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `成功提交 ${newVotes.length} 个投票`,
      votes: data
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/tags/votes - 获取投票统计
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('module_id');

    if (!moduleId) {
      return NextResponse.json(
        { error: '缺少 module_id 参数' },
        { status: 400 }
      );
    }

    // 获取所有投票数据
    const { data: votes, error } = await supabase
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
      .eq('module_id', moduleId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 在服务端进行计数和分组
    const voteCounts = votes?.reduce((acc: any, vote: any) => {
      const subcategoryId = vote.subcategory_id;
      if (!acc[subcategoryId]) {
        acc[subcategoryId] = {
          subcategory_id: subcategoryId,
          count: 0,
          tag_subcategories: vote.tag_subcategories
        };
      }
      acc[subcategoryId].count++;
      return acc;
    }, {});

    // 转换为数组格式
    const result = Object.values(voteCounts || {});

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/votes - 删除用户的投票记录（用于重新投票）
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { module_id, session_id } = body;

    if (!module_id || !session_id) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 首先查询要删除的记录数量
    const { data: existingVotes, error: queryError } = await supabase
      .from('tag_votes')
      .select('id')
      .eq('module_id', module_id)
      .eq('session_id', session_id);

    if (queryError) {
      return NextResponse.json({ error: queryError.message }, { status: 500 });
    }

    // 删除该用户对该模组的投票记录
    const { error, count } = await supabase
      .from('tag_votes')
      .delete({ count: 'exact' })
      .eq('module_id', module_id)
      .eq('session_id', session_id);

    if (error) {
      console.error('删除投票记录失败:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ 
      message: '投票记录已删除', 
      deletedCount: count || 0,
      foundCount: existingVotes?.length || 0
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}