import { useState, useCallback, useEffect } from 'react';
import { getCurrentWebview } from '@tauri-apps/api/webview';

interface VideoInfo {
  path: string;
  duration: number;
  width: number;
  height: number;
}

interface PreviewProps {
  videoUrl: string | null;
  videoInfo: VideoInfo | null;
  onFileDrop: (file: File) => void;
  onImportClick?: () => void;
}

const VIDEO_EXTENSIONS = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'];

export default function Preview({ videoUrl, videoInfo, onFileDrop, onImportClick }: PreviewProps) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const webview = getCurrentWebview();

    const unlisten = webview.onDragDropEvent((event) => {
      const payload = event.payload;
      console.log('[Tauri] drag event:', payload.type);

      if (payload.type === 'enter') {
        setIsDragging(true);
      } else if (payload.type === 'over') {
        // Just keep dragging state
      } else if (payload.type === 'drop') {
        setIsDragging(false);
        const paths = payload.paths;
        if (paths && paths.length > 0) {
          const filePath = paths[0];
          const ext = filePath.split('.').pop()?.toLowerCase() || '';
          console.log('[Tauri] dropped file:', filePath, ext);
          if (VIDEO_EXTENSIONS.includes(ext)) {
            // Create a File-like object with the path
            const file = {
              name: filePath.split(/[\\/]/).pop() || filePath,
              path: filePath,
            } as unknown as File;
            onFileDrop(file);
          } else {
            console.error('Unsupported file type:', ext);
          }
        }
      } else if (payload.type === 'leave') {
        setIsDragging(false);
      }
    });

    return () => {
      unlisten.then((fn: () => void) => fn());
    };
  }, [onFileDrop]);

  const handleClick = useCallback(() => {
    if (!videoUrl && onImportClick) {
      onImportClick();
    }
  }, [videoUrl, onImportClick]);

  return (
    <div className="h-full bg-[#1e1e1e] rounded-lg flex flex-col overflow-hidden">
      {/* Video Player */}
      <div
        className={`flex-1 flex items-center justify-center bg-black relative cursor-pointer ${
          isDragging ? 'ring-2 ring-[#4a9eff] ring-inset' : ''
        }`}
        onClick={handleClick}
      >
        {videoUrl ? (
          <video
            key={videoUrl}
            src={videoUrl}
            className="max-w-full max-h-full object-contain"
            controls
          />
        ) : (
          <div className={`text-center ${isDragging ? 'text-[#4a9eff]' : 'text-[#666]'}`}>
            <div className="text-4xl mb-2">📁</div>
            <div className="text-sm">
              {isDragging ? '松开以上传' : '拖拽视频到此处，或点击导入'}
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      {videoInfo && (
        <div className="h-8 bg-[#252525] flex items-center px-3 text-xs text-[#888] gap-4">
          <span>分辨率: {videoInfo.width}x{videoInfo.height}</span>
          <span>时长: {videoInfo.duration.toFixed(2)}s</span>
        </div>
      )}
    </div>
  );
}
