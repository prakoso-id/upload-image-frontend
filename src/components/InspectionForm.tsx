import { useMutation } from '@tanstack/react-query';
import { useInspectionStore } from '@/store/useInspectionStore';
import { ImageField } from './ImageField';
import { submitInspectionForm } from '@/services/api';

export const InspectionForm = () => {
  const { imageFields, addImageField, reset } = useInspectionStore();

  const submitMutation = useMutation({
    mutationFn: submitInspectionForm,
    onSuccess: () => {
      reset();
    },
  });

  const handleSubmit = async () => {
    await submitMutation.mutateAsync({ images: imageFields });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Status Messages */}
      {submitMutation.isSuccess && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Form submitted successfully!
        </div>
      )}
      
      {submitMutation.isError && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Failed to submit form. Please try again.
        </div>
      )}

      {/* Image Fields */}
      <div className="space-y-6 mb-8">
        {imageFields.map((field) => (
          <ImageField key={field.id} field={field} />
        ))}

        {imageFields.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            No images added yet. Click the button below to add your first image.
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <button
          onClick={addImageField}
          className="w-full py-3 px-4 border-2 border-dashed rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          + Add New Image
        </button>

        <button
          onClick={handleSubmit}
          disabled={imageFields.length === 0 || submitMutation.isPending}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitMutation.isPending ? 'Submitting...' : 'Submit Inspection'}
        </button>
      </div>

      
    </div>
  );
};
