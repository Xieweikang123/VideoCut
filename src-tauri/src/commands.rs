use serde::{Deserialize, Serialize};
use std::path::Path;

#[derive(Debug, Serialize, Deserialize)]
pub struct VideoInfo {
    pub path: String,
    pub duration: f64,
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClipData {
    pub id: String,
    pub source_path: String,
    pub start_time: f64,
    pub end_time: f64,
    pub in_point: f64,
    pub out_point: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ExportRequest {
    pub clips: Vec<ClipData>,
    pub output_path: String,
}

/// Get video information (placeholder - actual implementation requires FFmpeg)
#[tauri::command]
pub async fn get_video_info(path: String) -> Result<VideoInfo, String> {
    log::info!("Getting video info for: {}", path);

    if !Path::new(&path).exists() {
        return Err(format!("File not found: {}", path));
    }

    // Placeholder implementation - returns mock data
    // In production, this would use FFprobe to get actual video metadata
    Ok(VideoInfo {
        path,
        duration: 60.0,
        width: 1920,
        height: 1080,
    })
}

/// Export project with clips (placeholder - actual implementation requires FFmpeg)
#[tauri::command]
pub async fn export_project(request: ExportRequest) -> Result<String, String> {
    log::info!("Exporting project to: {}", request.output_path);
    log::info!("Number of clips: {}", request.clips.len());

    for (i, clip) in request.clips.iter().enumerate() {
        log::info!(
            "Clip {}: {} - {} (in: {}, out: {})",
            i,
            clip.source_path,
            clip.start_time,
            clip.in_point,
            clip.out_point
        );
    }

    // Placeholder implementation - actual export would use FFmpeg
    // Example FFmpeg concat command:
    // ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4

    Ok(format!("Export started: {} clips", request.clips.len()))
}
