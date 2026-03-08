import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // TODO: 从数据库或 KV 查询任务状态
  // TODO: 轮询 Replicate API 获取处理进度
  
  // 模拟返回状态
  const mockStatus = {
    taskId: id,
    status: 'processing', // uploaded | processing | completed | failed
    progress: 45,
    message: 'AI 正在去除背景...',
  };

  return NextResponse.json(mockStatus);
}
