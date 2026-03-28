export interface WorkstreamFile {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  source: string;
  created_at: string;
  summary?: string;
}

export interface WorkstreamFilesResponse {
  files: WorkstreamFile[];
  total: number;
  limit: number;
}

export interface TrackerFileInfo {
  id: string;
  name: string;
  content: string;
  updated_at: string;
}

export async function listWorkstreamFiles(_wsId: string): Promise<WorkstreamFilesResponse> {
  return { files: [], total: 0, limit: 20 };
}

export async function uploadWorkstreamFile() { return {} as WorkstreamFile; }
export async function deleteWorkstreamFile() {}
export async function getWorkstreamFileDownloadUrl() { return ""; }
export async function downloadWorkstreamFile() {}
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}
export async function getWorkstreamMemory(_wsId: string) { return { content: "" }; }
export async function updateWorkstreamMemory(_wsId: string, _content: string) {}
export async function getWorkstreamTrackers(_wsId: string): Promise<TrackerFileInfo[]> { return []; }
