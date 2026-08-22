import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./ConfirmDialog.module.css";
import { Modal } from "../Modal";
import { Button } from "../Button";
import { Text } from "../Typography";

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
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <Text>{message}</Text>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant="primary"
          className={clsx(danger && styles.confirmDanger)}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "در حال انجام..." : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
