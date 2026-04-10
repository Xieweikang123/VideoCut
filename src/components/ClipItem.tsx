import { Clip, useProjectStore } from '../store/projectStore';

interface ClipItemProps {
  clip: Clip;
  index: number;
  totalDuration: number;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ClipItem({
  clip,
  index,
  totalDuration,
  isSelected,
  onSelect,
}: ClipItemProps) {
  const { removeClip, splitClip, playheadTime } = useProjectStore();

  const duration = clip.outPoint - clip.inPoint;
  const widthPercent = (duration / totalDuration) * 100;
  const leftPercent = (clip.startTime / totalDuration) * 100;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeClip(clip.id);
  };

  const handleSplit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playheadTime >= clip.startTime && playheadTime <= clip.endTime) {
      splitClip(clip.id, playheadTime);
    }
  };

  const handleTrimStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Trim logic would go here - for now just log
    console.log('Trim start at:', playheadTime);
  };

  const handleTrimEnd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Trim logic would go here - for now just log
    console.log('Trim end at:', playheadTime);
  };

  return (
    <div
      className={`relative h-16 rounded cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-[#4a9eff]' : ''
      }`}
      style={{
        width: `${widthPercent}%`,
        left: `${leftPercent}%`,
        minWidth: '20px',
      }}
      onClick={handleClick}
    >
      {/* Clip Background */}
      <div
        className={`absolute inset-0 rounded ${
          isSelected ? 'bg-[#3a5a8a]' : 'bg-[#2a4a6a]'
        }`}
      >
        {/* Waveform placeholder */}
        <div className="absolute inset-x-0 bottom-0 h-4 bg-[#1a3a5a]" />
      </div>

      {/* Clip Label */}
      <div className="absolute inset-x-0 top-0 p-1 text-[10px] truncate">
        片段 {index + 1}
      </div>

      {/* Trim Handles */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 bg-[#4a9eff] opacity-0 hover:opacity-100 cursor-ew-resize"
        onMouseDown={handleTrimStart}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-2 bg-[#4a9eff] opacity-0 hover:opacity-100 cursor-ew-resize"
        onMouseDown={handleTrimEnd}
      />

      {/* Selected Clip Controls */}
      {isSelected && (
        <div className="absolute -top-6 left-0 right-0 flex gap-1 justify-center">
          <button
            onClick={handleSplit}
            className="px-2 py-0.5 text-[10px] bg-[#4a7c4e] hover:bg-[#5a8c5e] rounded"
          >
            分割
          </button>
          <button
            onClick={handleDelete}
            className="px-2 py-0.5 text-[10px] bg-[#8c4a4a] hover:bg-[#9c5a5a] rounded"
          >
            删除
          </button>
        </div>
      )}
    </div>
  );
}
