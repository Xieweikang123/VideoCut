import { useState, useCallback } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import Toolbar from './components/Toolbar';
import Preview from './components/Preview';
import Timeline from './components/Timeline';
import { useProjectStore } from './store/projectStore';

interface VideoInfo {
  path: string;
  duration: number;
  width: number;
  height: number;
}

function App() {
  const { addClip, clips, setSelectedClipId, selectedClipId } = useProjectStore();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  const handleImportVideo = useCallback(async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: 'Video',
            extensions: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'],
          },
        ],
      });

      if (selected && typeof selected === 'string') {
        console.log('Selected video:', selected);

        // Get video info from backend
        const info = await invoke<VideoInfo>('get_video_info', { path: selected });
        setVideoInfo(info);

        // Convert to file URL for HTML5 video
        // In Tauri, we use the asset protocol or convert file path
        setVideoUrl(`file://${selected}`);

        // Add clip to timeline
        addClip({
          id: crypto.randomUUID(),
          sourcePath: selected,
          startTime: 0,
          endTime: info.duration,
          inPoint: 0,
          outPoint: info.duration,
        });
      }
    } catch (error) {
      console.error('Failed to import video:', error);
    }
  }, [addClip]);

  const handleExport = useCallback(async () => {
    if (clips.length === 0) {
      alert('请先导入视频片段');
      return;
    }

    try {
      const outputPath = await open({
        defaultPath: 'output.mp4',
        filters: [{ name: 'Video', extensions: ['mp4'] }],
        directory: false,
      });

      if (outputPath && typeof outputPath === 'string') {
        const result = await invoke<string>('export_project', {
          request: {
            clips: clips.map((clip) => ({
              id: clip.id,
              source_path: clip.sourcePath,
              start_time: clip.startTime,
              end_time: clip.endTime,
              in_point: clip.inPoint,
              out_point: clip.outPoint,
            })),
            output_path: outputPath,
          },
        });
        console.log('Export result:', result);
        alert('导出完成');
      }
    } catch (error) {
      console.error('Failed to export:', error);
    }
  }, [clips]);

  return (
    <div className="h-full w-full flex flex-col bg-[#1a1a1a] text-white">
      {/* Toolbar */}
      <Toolbar onImport={handleImportVideo} onExport={handleExport} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Preview Area */}
        <div className="h-[60%] p-4">
          <Preview videoUrl={videoUrl} videoInfo={videoInfo} />
        </div>

        {/* Timeline */}
        <div className="h-[40%] border-t border-[#333]">
          <Timeline
            clips={clips}
            selectedClipId={selectedClipId}
            onSelectClip={setSelectedClipId}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
