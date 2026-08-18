import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./FileUpload.module.css";

export interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
  showPreview?: boolean;
}

export function FileUpload({
  onFilesSelected,
  accept,
  multiple = false,
  disabled = false,
  label = "فایل را بکشید و رها کنید یا کلیک کنید",
  className,
  selectedFiles,
  onRemoveFile,
  showPreview = false,
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    onFilesSelected(Array.from(fileList));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragActive(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={clsx(
          styles.dropzone,
          isDragActive && styles.dropzoneActive,
          disabled && styles.dropzoneDisabled,
        )}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
      >
        <svg
          className={styles.icon}
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>

        <span>{label}</span>

        <input
          ref={inputRef}
          type="file"
          className={styles.hiddenInput}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {selectedFiles && selectedFiles.length > 0 && (
        <div className={styles.fileList}>
          {selectedFiles.map((file, index) => (
            <FileListItem
              key={`${file.name}-${index}`}
              file={file}
              showPreview={showPreview}
              onRemove={onRemoveFile ? () => onRemoveFile(index) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FileListItemProps {
  file: File;
  showPreview: boolean;
  onRemove?: () => void;
}

function FileListItem({ file, showPreview, onRemove }: FileListItemProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isImage = file.type.startsWith("image/");

  useEffect(() => {
    if (!showPreview || !isImage) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file, showPreview, isImage]);

  return (
    <div className={styles.fileItem}>
      <div className={styles.fileInfo}>
        {showPreview && isImage && previewUrl && (
          <img src={previewUrl} alt={file.name} className={styles.thumbnail} />
        )}
        <span className={styles.fileName}>{file.name}</span>
      </div>

      {onRemove && (
        <button
          type="button"
          className={styles.fileRemove}
          onClick={onRemove}
          aria-label={`حذف ${file.name}`}
        >
          ✕
        </button>
      )}
    </div>
  );
}
