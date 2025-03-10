import axios from 'axios';
import { InspectionForm, UploadResponse } from '@/types/inspection';

// Create two separate axios instances for different base URLs
const uploadApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_UPLOAD_API_URL,
});

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_URL,
});

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'image');
  
  try {
    const response = await uploadApi.post('api/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-File-Type': 'image'
      },
    });

    const data = response.data.data;
    
    return {
      filename: data.url,
      message: 'Image uploaded successfully',
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

export const submitInspectionForm = async (data: InspectionForm) => {
  const response = await api.post('api/images', data);
  return response.data;
};

export const deleteImage = async (filename: string | null) => {
  try{
    const response = await uploadApi.post(`api/delete-file?url=${filename}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
};

interface PaginationParams {
  page?: number;
  per_page?: number;
}

export const getImages = async ({ page = 1, per_page = 10 }: PaginationParams = {}) => {
  try {
    const response = await api.get('api/images', {
      params: {
        page,
        per_page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw new Error('Failed to fetch images');
  }
};

export const destroyDataImage = async (id: string | null) => {
  try {
    const response = await api.delete(`api/images/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
};
