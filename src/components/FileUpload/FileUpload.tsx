import type { DragEvent, HTMLAttributes, Ref } from "react";
import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./FileUpload.module.css";
import type { RejectedFile, UploadedFile } from "./types";
import { formatFileSize, isImageFileName, validateFiles } from "./utils";
import { Modal } from "../Modal";

export interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  onFilesSelected: (files: UploadedFile[]) => void;
  files?: UploadedFile[];
  onRemoveFile?: (id: string) => void;

  name?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  hint?: string;
  className?: string;

  maxSize?: number;
  maxFiles?: number;
  validate?: (file: File) => string | null;
  onRejected?: (rejected: RejectedFile[]) => void;

  enablePreviewModal?: boolean;

  variant?: "default" | "preview";
  ref?: Ref<HTMLDivElement>;
}

export function FileUpload({
  onFilesSelected,
  files,
  onRemoveFile,
  name,
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
  variant = "default",
  ref,
  ...rest
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [previewItem, setPreviewItem] = useState<UploadedFile | null>(null);
  const [rejections, setRejections] = useState<RejectedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const createdUrlsRef = useRef<Set<string>>(new Set());
  const inputId = useId();

  const isPreviewVariant = variant === "preview";
  const currentCount = files?.length ?? 0;
  const isFull =
    !isPreviewVariant &&
    ((!multiple && currentCount > 0) || (maxFiles !== undefined && currentCount >= maxFiles));
  const isDisabled = disabled || isFull;

  const previewFile = isPreviewVariant ? files?.[0] : undefined;
  const previewFileIsImage =
    previewFile &&
    (previewFile.file
      ? previewFile.file.type.startsWith("image/")
      : isImageFileName(previewFile.name));

  function processFiles(fileList: FileList | null) {
    const rawFiles = fileList ? Array.from(fileList) : [];

    if (inputRef.current) inputRef.current.value = "";

    if (rawFiles.length === 0) return;

    const selectedFiles = multiple ? rawFiles : rawFiles.slice(0, 1);

    const { accepted, rejected } = validateFiles(selectedFiles, {
      accept,
      maxSize,
      maxFiles,
      currentCount,
      validate,
    });

    setRejections(rejected);
    if (rejected.length > 0) onRejected?.(rejected);

    if (accepted.length === 0) return;

    const wrapped: UploadedFile[] = accepted.map((file) => {
      const url = URL.createObjectURL(file);
      createdUrlsRef.current.add(url);

      return {
        id: `fara-file-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        url,
        size: file.size,
        file,
        status: "idle",
      };
    });

    onFilesSelected(wrapped);
  }

  useEffect(() => {
    const liveUrls = new Set((files ?? []).map((item) => item.url));

    for (const url of createdUrlsRef.current) {
      if (liveUrls.has(url)) continue;
      URL.revokeObjectURL(url);
      createdUrlsRef.current.delete(url);
    }
  }, [files]);

  useEffect(
    () => () => {
      for (const url of createdUrlsRef.current) URL.revokeObjectURL(url);
      createdUrlsRef.current.clear();
    },
    [],
  );

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragActive(false);
    if (isDisabled) return;
    processFiles(e.dataTransfer.files);
  }

  return (
    <div {...rest} ref={ref} data-fara-file-upload className={className}>
      <div
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled}
        data-fara-file-upload-dropzone
        data-variant={variant}
        data-drag-active={isDragActive || undefined}
        data-error={rejections.length > 0 || undefined}
        data-disabled={isDisabled || undefined}
        className={clsx(
          styles.dropzone,
          isPreviewVariant && styles.dropzonePreview,
          isDragActive && styles.dropzoneActive,
          rejections.length > 0 && styles.dropzoneError,
          isDisabled && styles.dropzoneDisabled,
        )}
        onClick={() => {
          if (isDisabled) return;

          const hasPreviewImage = isPreviewVariant && previewFile && previewFileIsImage;

          if (hasPreviewImage && previewFile) {
            if (enablePreviewModal) {
              setPreviewItem(previewFile);
            }

            return;
          }

          inputRef.current?.click();
        }}
        onKeyDown={(e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          if (isDisabled) return;

          e.preventDefault();

          const hasPreviewImage = isPreviewVariant && previewFile && previewFileIsImage;

          if (hasPreviewImage && previewFile) {
            if (enablePreviewModal) {
              setPreviewItem(previewFile);
            }

            return;
          }

          inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isDisabled) setIsDragActive(true);
        }}
        onDragLeave={(e) => {
          if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
          setIsDragActive(false);
        }}
        onDrop={handleDrop}
      >
        {isPreviewVariant && previewFile && previewFileIsImage ? (
          <>
            <img
              src={previewFile.url}
              alt={previewFile.name}
              data-fara-file-upload-preview-image
              className={styles.previewDropzoneImage}
            />

            {onRemoveFile && (
              <button
                type="button"
                data-fara-file-upload-preview-remove
                className={styles.previewDropzoneRemove}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile(previewFile.id);
                }}
                aria-label="حذف عکس"
              >
                ✕
              </button>
            )}
          </>
        ) : (
          <>
            <svg
              data-fara-file-upload-icon
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

            <span data-fara-file-upload-label>{label}</span>
            {hint && (
              <span data-fara-file-upload-hint className={styles.hint}>
                {hint}
              </span>
            )}
          </>
        )}

        <input
          id={inputId}
          ref={inputRef}
          type="file"
          name={name}
          data-fara-file-upload-input
          className={styles.hiddenInput}
          accept={accept}
          multiple={multiple}
          disabled={isDisabled}
          onChange={(e) => processFiles(e.target.files)}
        />
      </div>

      {rejections.length > 0 && (
        <div data-fara-file-upload-rejections className={styles.rejections}>
          {rejections.map((r, i) => (
            <div key={i} data-fara-file-upload-rejection className={styles.rejectionItem}>
              {r.message}
            </div>
          ))}
        </div>
      )}

      {!isPreviewVariant && files && files.length > 0 && (
        <div data-fara-file-upload-file-list className={styles.fileGrid}>
          {files.map((item) => {
            const isImage = item.file
              ? item.file.type.startsWith("image/")
              : isImageFileName(item.name);
            const canPreviewInModal = enablePreviewModal && isImage;
            const isClickable = canPreviewInModal || !isImage;

            function handleCardClick() {
              console.log("CLICK", item);
              console.log("canPreviewInModal:", canPreviewInModal);
              if (canPreviewInModal) {
                setPreviewItem(item);
              } else if (!isImage) {
                window.open(item.url, "_blank", "noopener,noreferrer");
              }
            }

            return (
              <div
                key={item.id}
                data-fara-file-upload-item
                data-status={item.status}
                data-clickable={isClickable || undefined}
                className={clsx(
                  styles.fileCard,
                  isClickable && styles.fileCardClickable,
                  item.status === "error" && styles.fileCardError,
                )}
                onClick={isClickable ? handleCardClick : undefined}
              >
                {isImage ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    data-fara-file-upload-item-preview
                    className={styles.previewImage}
                  />
                ) : (
                  <div data-fara-file-upload-item-placeholder className={styles.previewPlaceholder}>
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

                {item.status === "uploading" && (
                  <div data-fara-file-upload-item-progress className={styles.progressOverlay}>
                    {item.progress !== undefined ? `${Math.round(item.progress)}%` : "..."}
                  </div>
                )}

                {item.status === "success" && (
                  <span
                    data-fara-file-upload-item-status
                    data-status="success"
                    className={clsx(styles.statusIcon, styles.statusIconSuccess)}
                  >
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
                  <span
                    data-fara-file-upload-item-status
                    data-status="error"
                    className={clsx(styles.statusIcon, styles.statusIconError)}
                  >
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

                <div data-fara-file-upload-item-footer className={styles.fileCardFooter}>
                  <div data-fara-file-upload-item-name className={styles.fileCardName}>
                    {item.name}
                  </div>
                  {item.status === "error" && item.errorMessage ? (
                    <div data-fara-file-upload-item-error-text className={styles.fileCardErrorText}>
                      {item.errorMessage}
                    </div>
                  ) : (
                    item.size !== undefined && (
                      <div data-fara-file-upload-item-size className={styles.fileCardSize}>
                        {formatFileSize(item.size)}
                      </div>
                    )
                  )}
                </div>

                {onRemoveFile && (
                  <button
                    type="button"
                    data-fara-file-upload-item-remove
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
            <img
              src={previewItem.url}
              alt={previewItem.name}
              data-fara-file-upload-preview-large
              className={styles.previewLarge}
            />
          )}
        </Modal>
      )}
    </div>
  );
}
