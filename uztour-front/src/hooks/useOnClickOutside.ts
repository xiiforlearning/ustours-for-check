import { useEffect, RefObject } from "react";

/**
 * Calls `handler` whenever a user clicks or touches outside `ref.current`.
 */
export function useOnClickOutside(
  ref: RefObject<HTMLDivElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Abort if clicking inside the referenced element or ref is null
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
