type EscapeHandler = () => void;

interface OverlayEntry {
  id: number;
  onEscape: EscapeHandler;
}

const stack: OverlayEntry[] = [];
let listenerAttached = false;
let counter = 0;

function handleKeyDown(event: KeyboardEvent) {
  if (event.key !== "Escape") return;
  const top = stack[stack.length - 1];
  if (!top) return;
  top.onEscape();
}

function attachListener() {
  if (listenerAttached) return;
  document.addEventListener("keydown", handleKeyDown);
  listenerAttached = true;
}

function detachListenerIfIdle() {
  if (stack.length > 0 || !listenerAttached) return;
  document.removeEventListener("keydown", handleKeyDown);
  listenerAttached = false;
}

export function registerOverlay(onEscape: EscapeHandler): () => void {
  const id = ++counter;
  stack.push({ id, onEscape });
  attachListener();

  return () => {
    const index = stack.findIndex((entry) => entry.id === id);
    if (index !== -1) stack.splice(index, 1);
    detachListenerIfIdle();
  };
}
