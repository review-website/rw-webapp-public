import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/modules - 获取模组列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('modules')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (search) {
      // 支持数组字段的搜索，使用@@运算符进行全文搜索
      query = query.or(`name.ilike.%${search}%,system.ilike.%${search}%,description.ilike.%${search}%`);
      // 对于作者数组，我们需要使用contains操作符
      // 但Supabase的or查询可能不完美支持数组搜索，先简化处理
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 为每个模组获取投票统计
    const modulesWithStats = await Promise.all(
      (data || []).map(async (module) => {
        try {
          // 获取该模组的投票数量
          const { data: voteData, error: voteError } = await supabase
            .from('tag_votes')
            .select('subcategory_id')
            .eq('module_id', module.id);

          if (voteError) {
            console.error('获取投票统计失败:', voteError);
            return { ...module, vote_count: 0 };
          }

          return { ...module, vote_count: voteData?.length || 0 };
        } catch (error) {
          console.error('处理模组投票统计失败:', error);
          return { ...module, vote_count: 0 };
        }
      })
    );

    return NextResponse.json({
      modules: modulesWithStats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/modules - 创建新模组
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, author, system, description, purchase_url } = body;

    if (!name || !author) {
      return NextResponse.json(
        { error: '模组名称和作者是必填项' },
        { status: 400 }
      );
    }

    // 确保author是数组格式
    const authorArray = Array.isArray(author) ? author : [author];

    const { data, error } = await supabase
      .from('modules')
      .insert([{ name, author: authorArray, system, description, purchase_url }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}