import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;

    if (!file) {
      return NextResponse.json({ error: '没有文件' }, { status: 400 });
    }

    // 生成任务 ID
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // TODO: 实际上传到 Cloudflare R2 或 S3
    // TODO: 调用 Replicate API 开始处理
    
    // 模拟：存储任务信息（实际应该用数据库或 KV）
    // 这里先返回任务 ID
    
    return NextResponse.json({
      taskId,
      status: 'uploaded',
      message: '上传成功，开始处理',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '上传失败' },
      { status: 500 }
    );
  }
}
