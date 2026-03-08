import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { uploadToR2, generateFileKey, getSignedUrlFromR2 } from '@/lib/r2';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;

    if (!file) {
      return NextResponse.json({ error: '没有文件' }, { status: 400 });
    }

    // 验证文件大小 (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: '文件大小不能超过 50MB' }, { status: 400 });
    }

    // 验证文件类型
    if (!['video/mp4', 'video/quicktime', 'video/webm'].includes(file.type)) {
      return NextResponse.json({ error: '仅支持 MP4, MOV, WEBM 格式' }, { status: 400 });
    }

    // 生成任务 ID
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 上传到 R2
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileExtension = getFileExtension(file.name);
    const r2Key = generateFileKey(`uploads/${taskId}`, fileExtension);
    
    await uploadToR2(r2Key, buffer, file.type);

    // 获取预签名 URL（7 天有效）
    const videoUrl = await getSignedUrlFromR2(r2Key, 7 * 24 * 3600);

    // 调用 Replicate API
    const prediction = await replicate.predictions.create({
      version: "73d2128a371922d5d1abf0712a1d974be0e4e2358cc1218e4e34714767232bac",
      input: {
        input_video: videoUrl,
        output_type: "foreground-mask", // green-screen | alpha-mask | foreground-mask
      },
    });

    // 存储任务信息
    const taskInfo = {
      taskId,
      predictionId: prediction.id,
      status: 'processing',
      originalKey: r2Key,
      originalUrl: videoUrl,
      createdAt: new Date().toISOString(),
    };

    const taskDir = join(process.cwd(), 'public', 'tasks');
    await mkdir(taskDir, { recursive: true });
    await writeFile(
      join(taskDir, `${taskId}.json`),
      JSON.stringify(taskInfo, null, 2)
    );

    return NextResponse.json({
      taskId,
      status: 'uploaded',
      message: '上传成功，开始处理',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '上传失败' },
      { status: 500 }
    );
  }
}

function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop();
  return ext ? `.${ext}` : '.mp4';
}
