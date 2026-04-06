import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  type: 'alert' | 'confirm' | 'prompt';
  message: string;
  defaultValue?: string;
  onConfirm: (value?: string) => void;
  onCancel: () => void;
}

interface UiStore {
  modal: ModalState | null;
  showAlert: (message: string) => Promise<void>;
  showConfirm: (message: string) => Promise<boolean>;
  showPrompt: (message: string, defaultValue?: string) => Promise<string | null>;
  closeModal: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  modal: null,
  showAlert: (message) => new Promise((resolve) => {
    set({
      modal: {
        isOpen: true,
        type: 'alert',
        message,
        onConfirm: () => {
          set({ modal: null });
          resolve();
        },
        onCancel: () => {
          set({ modal: null });
          resolve();
        },
      }
    });
  }),
  showConfirm: (message) => new Promise((resolve) => {
    set({
      modal: {
        isOpen: true,
        type: 'confirm',
        message,
        onConfirm: () => {
          set({ modal: null });
          resolve(true);
        },
        onCancel: () => {
          set({ modal: null });
          resolve(false);
        },
      }
    });
  }),
  showPrompt: (message, defaultValue) => new Promise((resolve) => {
    set({
      modal: {
        isOpen: true,
        type: 'prompt',
        message,
        defaultValue,
        onConfirm: (value) => {
          set({ modal: null });
          resolve(value || null);
        },
        onCancel: () => {
          set({ modal: null });
          resolve(null);
        },
      }
    });
  }),
  closeModal: () => set({ modal: null }),
}));
