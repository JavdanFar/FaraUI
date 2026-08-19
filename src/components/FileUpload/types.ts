export type FileStatus = "idle" | "uploading" | "success" | "error";

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size?: number;
  file?: File;
  status?: FileStatus;
  progress?: number;
  errorMessage?: string;
}

export interface RejectedFile {
  name: string;
  reason: "type" | "size" | "count";
  message: string;
}
