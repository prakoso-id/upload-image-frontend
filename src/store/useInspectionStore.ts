import { create } from 'zustand';
import { ImageField } from '@/types/inspection';
import { deleteImage, destroyDataImage } from '@/services/api';

interface InspectionStore {
  imageFields: ImageField[];
  addImageField: () => void;
  removeImageField: (field: ImageField) => void;
  updateImageField: (id: string, updates: Partial<ImageField>) => void;
  setImageFields: (images: ImageField[]) => void;
  reset: () => void;
}

export const useInspectionStore = create<InspectionStore>((set) => ({
  imageFields: [],
  addImageField: () => {
    set((state) => ({
      imageFields: [
        { id: crypto.randomUUID(), imageUrl: null, label: '', path: null },
        ...state.imageFields,
      ],
    }));
  },
  removeImageField: (data: ImageField) => {
    deleteImage(data.path);
    destroyDataImage(data.id);
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
  setImageFields: (images: ImageField[]) => {
    set({ imageFields: images });
  },
  reset: () => {
    set({ imageFields: [] });
  },
}));
