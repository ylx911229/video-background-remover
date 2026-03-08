import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { getSignedUrlFromR2 } from '@/lib/r2';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 读取任务信息
    const taskPath = join(process.cwd(), 'public', 'tasks', `${id}.json`);
    const taskData = await readFile(taskPath, 'utf-8');
    const taskInfo = JSON.parse(taskData);

    if (!taskInfo.resultUrl) {
      return NextResponse.json({ error: '处理未完成' }, { status: 400 });
    }

    // 生成原始视频的预签名 URL
    const originalUrl = await getSignedUrlFromR2(taskInfo.originalKey, 3600);

    return NextResponse.json({
      taskId: id,
      originalUrl,
      resultUrl: taskInfo.resultUrl, // Replicate 的结果 URL
    });
  } catch (error) {
    console.error('Result fetch error:', error);
    return NextResponse.json(
      { error: '获取结果失败' },
      { status: 500 }
    );
  }
}
