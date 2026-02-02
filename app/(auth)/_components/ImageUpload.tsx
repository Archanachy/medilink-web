"use client";

import { useState } from "react";

interface ImageUploadProps {
    onImageChange: (file: File | null) => void;
    currentImage?: string;
    fieldName?: string;
}

export default function ImageUpload({
    onImageChange,
    currentImage,
    fieldName = 'profileImage'
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageChange(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
            </label>
            <div className="flex flex-col gap-4">
                {(preview || currentImage) && (
                    <img
                        src={preview || currentImage}
                        alt="Preview"
                        className="w-24 h-24 rounded-lg object-cover"
                    />
                )}
                <input
                    type="file"
                    name={fieldName}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-600
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
            </div>
        </div>
    );
}
