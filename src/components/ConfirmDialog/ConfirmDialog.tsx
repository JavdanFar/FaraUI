import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./ConfirmDialog.module.css";
import { Modal } from "../Modal";
import { Button } from "../Button";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "تایید عملیات",
  message,
  confirmLabel = "تایید",
  cancelLabel = "انصراف",
  danger = false,
  loading = false,
}: ConfirmDialogProps) {
  function handleClose() {
    if (loading) return;
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      <p className={styles.message} data-fara-confirm-dialog-message>{message}</p>

      <div className={styles.actions} data-fara-confirm-dialog-actions data-loading={loading || undefined}>
        <Button
          variant="secondary"
          data-fara-confirm-dialog-cancel
          onClick={handleClose}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant="primary"
          className={clsx(danger && styles.confirmDanger)}
          data-fara-confirm-dialog-confirm
          data-danger={danger || undefined}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "در حال انجام..." : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
