import { create } from 'zustand';

export interface Clip {
  id: string;
  sourcePath: string;
  startTime: number;
  endTime: number;
  inPoint: number;
  outPoint: number;
}

interface ProjectState {
  clips: Clip[];
  selectedClipId: string | null;
  playheadTime: number;
  zoom: number;
  addClip: (clip: Clip) => void;
  removeClip: (id: string) => void;
  updateClip: (id: string, updates: Partial<Clip>) => void;
  setSelectedClipId: (id: string | null) => void;
  setPlayheadTime: (time: number) => void;
  setZoom: (zoom: number) => void;
  splitClip: (id: string, time: number) => void;
  reorderClips: (fromIndex: number, toIndex: number) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  clips: [],
  selectedClipId: null,
  playheadTime: 0,
  zoom: 1,

  addClip: (clip) =>
    set((state) => ({
      clips: [...state.clips, clip],
    })),

  removeClip: (id) =>
    set((state) => ({
      clips: state.clips.filter((c) => c.id !== id),
      selectedClipId: state.selectedClipId === id ? null : state.selectedClipId,
    })),

  updateClip: (id, updates) =>
    set((state) => ({
      clips: state.clips.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  setSelectedClipId: (id) => set({ selectedClipId: id }),

  setPlayheadTime: (time) => set({ playheadTime: time }),

  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(10, zoom)) }),

  splitClip: (id, time) =>
    set((state) => {
      const clip = state.clips.find((c) => c.id === id);
      if (!clip) return state;

      const splitPoint = time - clip.startTime + clip.inPoint;

      // Don't split if at edges
      if (splitPoint <= clip.inPoint || splitPoint >= clip.outPoint) {
        return state;
      }

      const firstClip: Clip = {
        ...clip,
        outPoint: splitPoint,
      };

      const secondClip: Clip = {
        ...clip,
        id: crypto.randomUUID(),
        inPoint: splitPoint,
        startTime: time,
      };

      return {
        clips: state.clips.flatMap((c) => (c.id === id ? [firstClip, secondClip] : [c])),
      };
    }),

  reorderClips: (fromIndex, toIndex) =>
    set((state) => {
      const newClips = [...state.clips];
      const [removed] = newClips.splice(fromIndex, 1);
      newClips.splice(toIndex, 0, removed);

      // Recalculate start/end times based on new order
      let currentTime = 0;
      const recalculated = newClips.map((clip) => {
        const duration = clip.outPoint - clip.inPoint;
        const newStartTime = currentTime;
        currentTime += duration;
        return { ...clip, startTime: newStartTime, endTime: currentTime };
      });

      return { clips: recalculated };
    }),
}));
