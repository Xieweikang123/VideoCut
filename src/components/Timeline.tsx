import { Clip, useProjectStore } from '../store/projectStore';
import ClipItem from './ClipItem';

interface TimelineProps {
  clips: Clip[];
  selectedClipId: string | null;
  onSelectClip: (id: string | null) => void;
}

export default function Timeline({ clips, selectedClipId, onSelectClip }: TimelineProps) {
  const { playheadTime, setPlayheadTime, zoom, setZoom } = useProjectStore();

  const totalDuration = clips.reduce((acc, clip) => acc + (clip.outPoint - clip.inPoint), 0);
  const timelineWidth = Math.max(totalDuration * 50 * zoom, 800);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / (timelineWidth / totalDuration));
    setPlayheadTime(Math.max(0, Math.min(time, totalDuration)));
    onSelectClip(null);
  };

  const handleZoomIn = () => setZoom(zoom * 1.2);
  const handleZoomOut = () => setZoom(zoom / 1.2);

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a]">
      {/* Timeline Header */}
      <div className="h-8 bg-[#252525] border-b border-[#333] flex items-center px-2 gap-2">
        <span className="text-xs text-[#888]">时间线</span>
        <div className="flex-1" />
        <span className="text-xs text-[#666]">{formatTime(playheadTime)}</span>
        <div className="h-4 w-px bg-[#444]" />
        <button
          onClick={handleZoomOut}
          className="text-xs text-[#888] hover:text-white px-1"
        >
          -
        </button>
        <span className="text-xs text-[#666] w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="text-xs text-[#888] hover:text-white px-1"
        >
          +
        </button>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-auto">
        <div
          className="relative min-h-full cursor-pointer"
          style={{ width: `${timelineWidth}px` }}
          onClick={handleTimelineClick}
        >
          {/* Time Ruler */}
          <div className="h-6 bg-[#2a2a2a] border-b border-[#333] sticky top-0 z-10">
            {clips.length > 0 &&
              Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-full border-l border-[#444]"
                  style={{ left: `${(i / totalDuration) * 100}%` }}
                >
                  <span className="text-[10px] text-[#666] ml-1">{i}s</span>
                </div>
              ))}
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-[#ff4444] z-20 pointer-events-none"
            style={{ left: `${(playheadTime / totalDuration) * 100}%` }}
          />

          {/* Clips */}
          <div className="pt-6">
            {clips.length === 0 ? (
              <div className="h-24 flex items-center justify-center text-[#666] text-sm">
                导入视频以添加片段
              </div>
            ) : (
              <div className="flex gap-1 px-1">
                {clips.map((clip, index) => (
                  <ClipItem
                    key={clip.id}
                    clip={clip}
                    index={index}
                    totalDuration={totalDuration}
                    isSelected={selectedClipId === clip.id}
                    onSelect={() => onSelectClip(clip.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
