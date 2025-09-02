import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/tags/categories - 获取所有标签分类
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tag_categories')
      .select(`
        *,
        tag_subcategories (
          id,
          name,
          description,
          order_index
        )
      `)
      .order('order_index');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}