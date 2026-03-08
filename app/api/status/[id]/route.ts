import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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

    // 查询 Replicate 状态
    const prediction = await replicate.predictions.get(taskInfo.predictionId);

    let status = 'processing';
    let progress = 0;
    let message = 'AI 正在处理...';

    if (prediction.status === 'succeeded') {
      status = 'completed';
      progress = 100;
      message = '处理完成！';
      
      // 保存结果 URL
      taskInfo.resultUrl = prediction.output;
      taskInfo.status = 'completed';
      await writeFile(taskPath, JSON.stringify(taskInfo, null, 2));
    } else if (prediction.status === 'failed') {
      status = 'failed';
      message = '处理失败，请重试';
    } else if (prediction.status === 'processing') {
      // 根据时间估算进度
      const elapsed = Date.now() - new Date(taskInfo.createdAt).getTime();
      progress = Math.min(Math.floor((elapsed / 120000) * 100), 95); // 假设 2 分钟完成
      message = 'AI 正在去除背景...';
    } else {
      progress = 10;
      message = '准备处理...';
    }

    return NextResponse.json({
      taskId: id,
      status,
      progress,
      message,
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: '获取状态失败' },
      { status: 500 }
    );
  }
}
