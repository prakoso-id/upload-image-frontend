import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useInspectionStore } from '@/store/useInspectionStore';
import { ImageField } from './ImageField';
import { submitInspectionForm, getImages } from '@/services/api';
import { useState, useEffect } from 'react';

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface ImageResponse {
  data: Array<{
    id: string;
    path: string;
    imageUrl: string;
    label?: string;
  }>;
  meta: PaginationMeta;
}

export const InspectionForm = () => {
  const { imageFields, addImageField, setImageFields, reset } = useInspectionStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { data, isLoading, isFetching } = useQuery<ImageResponse>({
    queryKey: ['images', page, perPage],
    queryFn: () => getImages({ page, per_page: perPage }),
  });

  // Update store whenever data changes
  useEffect(() => {
    if (data?.data) {
      const images = data.data.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
        label: image.label || '',
        path: image.path || null,
      }));
      setImageFields(images);
    }
  }, [data, setImageFields]);

  const submitMutation = useMutation({
    mutationFn: submitInspectionForm,
    onSuccess: () => {
      // Refetch images after successful submission
      queryClient.invalidateQueries({ queryKey: ['images'] });
      reset();
    },
  });

  const handleSubmit = async () => {
    await submitMutation.mutateAsync({ images: imageFields });
  };

  const handleNextPage = () => {
    setPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Status Messages */}
      {isLoading && <div className="text-gray-500">Loading images...</div>}
      {isFetching && !isLoading && <div className="text-gray-500">Fetching new page...</div>}
      
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

      {/* Actions */}
      <div className="mt-8 space-y-4" role="group" aria-label="Form Actions">
      <button
          onClick={handleSubmit}
          type="submit"
          disabled={submitMutation.isPending || imageFields.length === 0}
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          aria-label={submitMutation.isPending ? 'Submitting inspection form...' : 'Submit inspection form'}
        >
          {submitMutation.isPending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Inspection'
          )}
        </button>
        
        <button
          onClick={addImageField}
          type="button"
          className="group relative w-full py-4 px-6 border-2 border-dashed rounded-lg text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          aria-label="Add new image field"
        >
          <span className="flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Image Field
          </span>
          <span className="mt-1 block text-sm text-gray-500">
            Click to add a new image upload field
          </span>
        </button>

        
      </div>

      {/* Image Fields */}
      <div className="space-y-6 mb-8 mt-8">
        {imageFields.map((field) => (
          <ImageField key={field.id} field={field} />
        ))}

        {imageFields.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            No images added yet. Click the button below to add your first image.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {data?.meta && data.meta.total > 0 && (
        <div className="mt-6 flex flex-col items-center space-y-4">
          <div className="flex justify-center items-center space-x-4 select-none">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Previous page"
            >
              <svg
                className="w-5 h-5 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex items-center space-x-1">
              {[...Array(data.meta.last_page)].map((_, idx) => {
                const pageNumber = idx + 1;
                const isCurrentPage = pageNumber === data.meta.current_page;
                const isNearCurrent = Math.abs(pageNumber - data.meta.current_page) <= 1;
                const isFirstOrLast = pageNumber === 1 || pageNumber === data.meta.last_page;

                if (isNearCurrent || isFirstOrLast) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      disabled={isCurrentPage}
                      className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                        isCurrentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                      aria-label={`Page ${pageNumber}`}
                      aria-current={isCurrentPage ? 'page' : undefined}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  (idx === 1 && data.meta.current_page > 3) ||
                  (idx === data.meta.last_page - 2 && data.meta.current_page < data.meta.last_page - 2)
                ) {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={handleNextPage}
              disabled={page >= data.meta.last_page}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Next page"
            >
              Next
              <svg
                className="w-5 h-5 ml-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Showing {Math.min((data.meta.current_page - 1) * data.meta.per_page + 1, data.meta.total)} to{' '}
            {Math.min(data.meta.current_page * data.meta.per_page, data.meta.total)} of {data.meta.total} entries
          </div>
        </div>
      )}
    </div>
  );
};
