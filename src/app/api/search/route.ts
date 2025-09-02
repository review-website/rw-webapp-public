import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 明确声明这是动态路由
export const dynamic = 'force-dynamic';

// GET /api/search - 搜索模组和标签
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all'; // all, modules, tags
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: '搜索关键词至少需要2个字符' },
        { status: 400 }
      );
    }

    const searchTerm = query.trim();
    const results: any = {};

    // 搜索模组
    if (type === 'all' || type === 'modules') {
      const { data: modules, error: moduleError } = await supabase
        .from('modules')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,system.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (moduleError) {
        console.error('模组搜索错误:', moduleError);
      } else {
        results.modules = modules || [];
      }
    }

    // 搜索标签
    if (type === 'all' || type === 'tags') {
      // 搜索一级分类
      const { data: categories, error: categoryError } = await supabase
        .from('tag_categories')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .limit(limit);

      // 搜索二级标签
      const { data: subcategories, error: subcategoryError } = await supabase
        .from('tag_subcategories')
        .select(`
          *,
          tag_categories (
            id,
            name
          )
        `)
        .ilike('name', `%${searchTerm}%`)
        .limit(limit);

      if (categoryError) {
        console.error('分类搜索错误:', categoryError);
      }
      if (subcategoryError) {
        console.error('子标签搜索错误:', subcategoryError);
      }

      results.tags = {
        categories: categories || [],
        subcategories: subcategories || []
      };
    }

    return NextResponse.json({
      query: searchTerm,
      results,
      total: {
        modules: results.modules?.length || 0,
        categories: results.tags?.categories?.length || 0,
        subcategories: results.tags?.subcategories?.length || 0
      }
    });

  } catch (error) {
    console.error('搜索错误:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}