interface ToolbarProps {
  onImport: () => void;
  onExport: () => void;
}

export default function Toolbar({ onImport, onExport }: ToolbarProps) {
  return (
    <div className="h-12 bg-[#252525] border-b border-[#333] flex items-center px-4 gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-[#888]">VideoCut</span>
      </div>

      <div className="h-6 w-px bg-[#444] mx-2" />

      <button
        onClick={onImport}
        className="px-3 py-1.5 text-sm bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded transition-colors"
      >
        导入
      </button>

      <button
        onClick={onExport}
        className="px-3 py-1.5 text-sm bg-[#4a7c4e] hover:bg-[#5a8c5e] rounded transition-colors"
      >
        导出
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2 text-xs text-[#666]">
        <span>v1.0.0</span>
      </div>
    </div>
  );
}
