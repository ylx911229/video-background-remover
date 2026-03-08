'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface TaskStatus {
  taskId: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
}

export default function ProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/status/${taskId}`);
        if (!response.ok) throw new Error('获取状态失败');
        
        const data = await response.json();
        setStatus(data);

        // 如果完成，跳转到结果页
        if (data.status === 'completed') {
          router.push(`/result/${taskId}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取状态失败');
      }
    };

    // 立即执行一次
    pollStatus();

    // 每 3 秒轮询一次
    const interval = setInterval(pollStatus, 3000);

    return () => clearInterval(interval);
  }, [taskId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-600">VideoMatte</h1>
          </div>

          {error ? (
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">处理失败</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => router.push('/')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                返回首页
              </button>
            </div>
          ) : (
            <div className="text-center">
              {/* Spinner */}
              <div className="mb-6">
                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto"></div>
              </div>

              {/* Status */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {status?.status === 'uploaded' && '准备处理'}
                {status?.status === 'processing' && 'AI 正在处理'}
              </h2>
              <p className="text-gray-600 mb-6">
                {status?.message || '请稍候...'}
              </p>

              {/* Progress Bar */}
              {status && status.progress > 0 && (
                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${status.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{status.progress}%</p>
                </div>
              )}

              {/* Estimated Time */}
              <p className="text-sm text-gray-500">
                预计需要 1-3 分钟
              </p>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>💡 提示：处理完成后会自动跳转</p>
        </div>
      </div>
    </div>
  );
}
