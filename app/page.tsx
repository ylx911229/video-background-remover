'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 验证文件大小 (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('文件大小不能超过 50MB');
      return;
    }

    // 验证文件类型
    if (!['video/mp4', 'video/quicktime', 'video/webm'].includes(file.type)) {
      setError('仅支持 MP4, MOV, WEBM 格式');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const data = await response.json();
      router.push(`/processing/${data.taskId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败，请重试');
      setUploading(false);
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/webm': ['.webm'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-600">VideoMatte</h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            AI 视频背景去除，30 秒搞定
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            无需绿幕，自动抠像，支持 1080p
          </p>
        </div>

        {/* Upload Area */}
        <div className="max-w-2xl mx-auto mb-16">
          <div
            {...getRootProps()}
            className={`
              border-4 border-dashed rounded-2xl p-12 text-center cursor-pointer
              transition-all duration-200
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            {uploading ? (
              <div>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-700">上传中...</p>
              </div>
            ) : (
              <div>
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-lg text-gray-700 mb-2">
                  {isDragActive ? '松开鼠标上传' : '拖拽视频到这里，或点击选择'}
                </p>
                <p className="text-sm text-gray-500">
                  支持 MP4, MOV, WEBM · 最大 50MB
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">快速处理</h3>
            <p className="text-gray-600">AI 自动识别，1-3 分钟完成</p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">隐私安全</h3>
            <p className="text-gray-600">视频自动删除，不做训练</p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">高清输出</h3>
            <p className="text-gray-600">支持 1080p，边缘清晰</p>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center mb-8">适用场景</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl">
              <h4 className="font-semibold text-lg mb-2">📱 短视频创作</h4>
              <p className="text-gray-600 text-sm">TikTok、抖音、快手，快速换背景</p>
            </div>
            <div className="bg-white p-6 rounded-xl">
              <h4 className="font-semibold text-lg mb-2">🛍️ 电商产品</h4>
              <p className="text-gray-600 text-sm">产品展示视频，统一白色背景</p>
            </div>
            <div className="bg-white p-6 rounded-xl">
              <h4 className="font-semibold text-lg mb-2">🎬 广告制作</h4>
              <p className="text-gray-600 text-sm">快速合成，节省后期时间</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t mt-16">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2026 VideoMatte. Powered by AI.</p>
        </div>
      </footer>
    </div>
  );
}
