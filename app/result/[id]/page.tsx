'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  
  const [downloading, setDownloading] = useState(false);

  // TODO: 从 API 获取实际的视频 URL
  const originalVideoUrl = '/placeholder-original.mp4';
  const processedVideoUrl = '/placeholder-processed.webm';

  const handleDownload = async (format: 'webm' | 'mp4') => {
    setDownloading(true);
    try {
      // TODO: 实际下载逻辑
      const url = format === 'webm' ? processedVideoUrl : processedVideoUrl;
      const link = document.createElement('a');
      link.href = url;
      link.download = `video-no-bg-${taskId}.${format}`;
      link.click();
    } catch (error) {
      alert('下载失败，请重试');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="py-6 px-4 border-b">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">VideoMatte</h1>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            处理新视频
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">处理完成！</h2>
          <p className="text-gray-600">背景已成功去除</p>
        </div>

        {/* Video Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Original */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900">原始视频</h3>
            <div className="bg-gray-100 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
              <p className="text-gray-500">原始视频预览</p>
              {/* <video src={originalVideoUrl} controls className="w-full h-full" /> */}
            </div>
          </div>

          {/* Processed */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900">去除背景后</h3>
            <div className="bg-gray-100 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
              <p className="text-gray-500">处理后视频预览</p>
              {/* <video src={processedVideoUrl} controls className="w-full h-full" /> */}
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6 text-center">下载视频</h3>
            
            <div className="space-y-4">
              {/* WebM with Alpha */}
              <button
                onClick={() => handleDownload('webm')}
                disabled={downloading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
              >
                <div className="text-left">
                  <div className="font-semibold">透明背景 (WebM)</div>
                  <div className="text-sm opacity-90">适合视频合成，支持透明通道</div>
                </div>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </button>

              {/* MP4 with Green Screen */}
              <button
                onClick={() => handleDownload('mp4')}
                disabled={downloading}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
              >
                <div className="text-left">
                  <div className="font-semibold">绿幕背景 (MP4)</div>
                  <div className="text-sm opacity-90">兼容性更好，适合大多数编辑软件</div>
                </div>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </button>
            </div>

            {/* Watermark Notice */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 text-center">
                ⚠️ 免费版包含水印 · 升级 Pro 版去除水印
              </p>
            </div>
          </div>
        </div>

        {/* Share or Process Another */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            处理另一个视频
          </button>
        </div>
      </main>
    </div>
  );
}
