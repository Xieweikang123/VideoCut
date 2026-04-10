interface VideoInfo {
  path: string;
  duration: number;
  width: number;
  height: number;
}

interface PreviewProps {
  videoUrl: string | null;
  videoInfo: VideoInfo | null;
}

export default function Preview({ videoUrl, videoInfo }: PreviewProps) {
  return (
    <div className="h-full bg-[#1e1e1e] rounded-lg flex flex-col overflow-hidden">
      {/* Video Player */}
      <div className="flex-1 flex items-center justify-center bg-black">
        {videoUrl ? (
          <video
            key={videoUrl}
            src={videoUrl}
            className="max-w-full max-h-full object-contain"
            controls
          />
        ) : (
          <div className="text-[#666] text-sm">导入视频以开始编辑</div>
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
