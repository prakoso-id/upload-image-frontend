import { ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { ImageField as IImageField } from '@/types/inspection';
import { useInspectionStore } from '@/store/useInspectionStore';
import { useMutation } from '@tanstack/react-query';
import { uploadImage, deleteImage } from '@/services/api';

interface ImageFieldProps {
  field: IImageField;
}

export const ImageField = ({ field }: ImageFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateImageField, removeImageField } = useInspectionStore();

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: async (data) => {
      // Delete the old image if it exists
      if (field.path) {
        try {
          await deleteImage(field.path);
        } catch (error) {
          console.error('Error deleting old image:', error);
          // Continue with updating the new image even if deletion fails
        }
      }

      // Update the image URL in the store only if we have a filename
      if (data.filename) {
        updateImageField(field.id, { 
          imageUrl: `${process.env.NEXT_PUBLIC_UPLOAD_API_URL}${data.filename}`,
          path: data.filename 
        });
      } else {
        throw new Error('No filename received from server');
      }
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    }
  });

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size should be less than 5MB');
      return;
    }

    try {
      await uploadMutation.mutateAsync(file);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateImageField(field.id, { label: e.target.value });
  };

  return (
    <div className="p-4 border rounded-lg mb-4">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          value={field.label}
          onChange={handleLabelChange}
          placeholder="Enter image label"
          className="flex-1 px-3 py-2 border rounded text-black"
        />
        <button
          onClick={() => removeImageField(field)}
          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
        >
          Remove
        </button>
      </div>

      <div className="relative min-h-[200px] border-2 border-dashed rounded-lg overflow-hidden">
        {field.imageUrl ? (
          <div className="relative w-full h-[200px] group">
            <Image
              src={`${field.imageUrl}`}
              alt={field.label || 'Uploaded image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 w-full h-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Click to change image
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 w-full h-full flex items-center justify-center text-gray-500 hover:bg-gray-50"
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Click to upload image'}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {uploadMutation.isPending && (
        <div className="mt-2 text-blue-600 flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Uploading...
        </div>
      )}
      {uploadMutation.isError && (
        <div className="mt-2 text-red-600 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Upload failed. Please try again.
        </div>
      )}
    </div>
  );
};
