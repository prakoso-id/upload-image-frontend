import { create } from 'zustand';
import { ImageField } from '@/types/inspection';
import { DeleteImage } from '@/services/api';

interface InspectionStore {
  imageFields: ImageField[];
  addImageField: () => void;
  removeImageField: (field: ImageField) => void;
  updateImageField: (id: string, updates: Partial<ImageField>) => void;
  reset: () => void;
}

export const useInspectionStore = create<InspectionStore>((set) => ({
  imageFields: [],
  addImageField: () => {
    set((state) => ({
      imageFields: [
        ...state.imageFields,
        { id: crypto.randomUUID(), imageUrl: null, label: '', path: null },
      ],
    }));
  },
  removeImageField: (data: ImageField) => {
    DeleteImage(data.path);
    set((state) => ({
      imageFields: state.imageFields.filter((field) => field.id !== data.id),
    }));
  },
  updateImageField: (id, updates) => {
    set((state) => ({
      imageFields: state.imageFields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    }));
  },
  reset: () => {
    set({ imageFields: [] });
  },
}));
