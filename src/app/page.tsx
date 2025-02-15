'use client';


import { InspectionForm } from '@/components/InspectionForm';

export default function Home() {
  return (
    
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Car Inspection Form</h1>
            <p className="mt-2 text-gray-600">
              Upload inspection photos and add descriptions for each image.
            </p>
          </header>
          
          <InspectionForm />
        </div>
      </div>
  );
}
