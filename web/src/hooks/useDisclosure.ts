import { useCallback, useState } from 'react';

export type UseDisclosureReturn = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
};

export function useDisclosure(initial = false): UseDisclosureReturn {
  const [open, setOpen] = useState(initial);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen((value) => !value), []);

  return { open, onOpen, onClose, onToggle };
}
