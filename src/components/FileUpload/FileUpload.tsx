import { useId, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./FileUpload.module.css";
import type { RejectedFile, UploadedFile } from "./types";
import { formatFileSize, isImageFileName, validateFiles } from "./utils";
import { Modal } from "../Modal";

export interface FileUploadProps {
  // Called with newly (locally) selected files, already wrapped as
  // UploadedFile objects with a fresh object URL for preview.
  onFilesSelected: (files: UploadedFile[]) => void;
  // The full current list — mix of already-uploaded (server) files and
  // freshly-selected local files, however the parent wants to compose them.
  files?: UploadedFile[];
  onRemoveFile?: (id: string) => void;

  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  hint?: string;
  className?: string;

  // Max size per file, in bytes. Enforced regardless of selection method
  // (dialog or drag & drop).
  maxSize?: number;
  // Max total number of files allowed in `files`.
  maxFiles?: number;
  // Optional custom validation, return an error message to reject the file.
  validate?: (file: File) => string | null;
  // Called with any files that failed validation (wrong type, too large,
  // too many, or failed custom validation).
  onRejected?: (rejected: RejectedFile[]) => void;

  // Clicking an image thumbnail opens it full-size in a modal.
  enablePreviewModal?: boolean;
}

export function FileUpload({
  onFilesSelected,
  files,
  onRemoveFile,
  accept,
  multiple = false,
  disabled = false,
  label = "فایل را بکشید و رها کنید یا کلیک کنید",
  hint,
  className,
  maxSize,
  maxFiles,
  validate,
  onRejected,
  enablePreviewModal = true,
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [previewItem, setPreviewItem] = useState<UploadedFile | null>(null);
  const [rejections, setRejections] = useState<RejectedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const currentCount = files?.length ?? 0;
  const isFull =
    (!multiple && currentCount > 0) || (maxFiles !== undefined && currentCount >= maxFiles);
  const isDisabled = disabled || isFull;

  function processFiles(fileList: FileList | null) {
    if (!fileList) return;

    const rawFiles = multiple ? Array.from(fileList) : Array.from(fileList).slice(0, 1);

    const { accepted, rejected } = validateFiles(rawFiles, {
      accept,
      maxSize,
      maxFiles,
      currentCount,
      validate,
    });

    setRejections(rejected);
    if (rejected.length > 0) onRejected?.(rejected);

    if (accepted.length === 0) return;

    const wrapped: UploadedFile[] = accepted.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      file,
      status: "idle",
    }));

    onFilesSelected(wrapped);

    // Allow selecting the same file again after removing it
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragActive(false);
    if (isDisabled) return;
    processFiles(e.dataTransfer.files);
  }

  return (
    <div className={className}>
      <label htmlFor={inputId} className={styles.hiddenInput} aria-hidden="true" />
      <div
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled}
        className={clsx(
          styles.dropzone,
          isDragActive && styles.dropzoneActive,
          rejections.length > 0 && styles.dropzoneError,
          isDisabled && styles.dropzoneDisabled,
        )}
        onClick={() => !isDisabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isDisabled) setIsDragActive(true);
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
        {hint && <span className={styles.hint}>{hint}</span>}

        <input
          id={inputId}
          ref={inputRef}
          type="file"
          className={styles.hiddenInput}
          accept={accept}
          multiple={multiple}
          disabled={isDisabled}
          onChange={(e) => processFiles(e.target.files)}
        />
      </div>

      {rejections.length > 0 && (
        <div className={styles.rejections}>
          {rejections.map((r, i) => (
            <div key={i} className={styles.rejectionItem}>
              {r.message}
            </div>
          ))}
        </div>
      )}

      {files && files.length > 0 && (
        <div className={styles.fileGrid}>
          {files.map((item) => {
            const isImage = item.file
              ? item.file.type.startsWith("image/")
              : isImageFileName(item.name);
            const canPreviewInModal = enablePreviewModal && isImage;
            const isClickable = canPreviewInModal || !isImage;
            const isUploading = item.status === "uploading";

            function handleCardClick() {
              if (canPreviewInModal) {
                setPreviewItem(item);
              } else if (!isImage) {
                window.open(item.url, "_blank", "noopener,noreferrer");
              }
            }

            return (
              <div
                key={item.id}
                className={clsx(
                  styles.fileCard,
                  isClickable && styles.fileCardClickable,
                  item.status === "error" && styles.fileCardError,
                )}
                onClick={isClickable ? handleCardClick : undefined}
              >
                {isImage ? (
                  <img src={item.url} alt={item.name} className={styles.previewImage} />
                ) : (
                  <div className={styles.previewPlaceholder}>
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                )}

                {isUploading && (
                  <div className={styles.progressOverlay}>
                    {item.progress !== undefined ? `${Math.round(item.progress)}%` : "..."}
                  </div>
                )}

                {item.status === "success" && (
                  <span className={clsx(styles.statusIcon, styles.statusIconSuccess)}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}

                {item.status === "error" && (
                  <span className={clsx(styles.statusIcon, styles.statusIconError)}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                )}

                <div className={styles.fileCardFooter}>
                  <div className={styles.fileCardName}>{item.name}</div>
                  {item.status === "error" && item.errorMessage ? (
                    <div className={styles.fileCardErrorText}>{item.errorMessage}</div>
                  ) : (
                    item.size !== undefined && (
                      <div className={styles.fileCardSize}>{formatFileSize(item.size)}</div>
                    )
                  )}
                </div>

                {onRemoveFile && (
                  <button
                    type="button"
                    className={styles.fileCardRemove}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(item.id);
                    }}
                    aria-label={`حذف ${item.name}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {enablePreviewModal && (
        <Modal
          open={previewItem !== null}
          onClose={() => setPreviewItem(null)}
          title={previewItem?.name}
        >
          {previewItem && (
            <img src={previewItem.url} alt={previewItem.name} className={styles.previewLarge} />
          )}
        </Modal>
      )}
    </div>
  );
}
