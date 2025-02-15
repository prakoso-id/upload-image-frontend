export interface ImageField {
  id: string;
  imageUrl: string | null;
  label: string;
  path: string | null;
}

export interface InspectionForm {
  images: ImageField[];
}

export interface UploadResponse {
  filename?: string;          // URL path returned from the upload API
  message?: string;     // Optional success/error message
}

export interface ApiError {
  message: string;
  status?: number;
}
