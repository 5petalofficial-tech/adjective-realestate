// src/components/blogs/ImageUploadField.jsx
// Client Component. Holds raw File objects in state — actual Cloudinary
// upload happens server-side when the form submits (multipart/form-data),
// this component only handles picking files + local preview.

"use client";

import { useRef } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

/**
 * Single featured image field.
 * @param {File|null} file - newly picked file, if any
 * @param {string|null} existingUrl - current saved image URL (edit mode)
 * @param {(file: File|null) => void} onChange
 */
export const FeaturedImageField = ({ file, existingUrl, onChange }) => {
  const inputRef = useRef(null);
  const previewUrl = file ? URL.createObjectURL(file) : existingUrl;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />

      {previewUrl ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 group">
          <Image src={previewUrl} alt="Featured" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-sm font-medium px-3 py-1.5 rounded-md"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="bg-white text-red-600 p-1.5 rounded-md"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#6b7c4d] hover:text-[#6b7c4d] transition-colors"
        >
          <ImagePlus size={28} />
          <span className="text-sm font-medium">Click to upload featured image</span>
          <span className="text-xs">Recommended: 1200x630px</span>
        </button>
      )}
    </div>
  );
};

/**
 * Gallery — multiple images, add/remove.
 * @param {File[]} files - newly picked files
 * @param {Array<{url,publicId}>} existingImages - already-saved gallery images (edit mode)
 * @param {(files: File[]) => void} onFilesChange
 * @param {(index: number) => void} onRemoveExisting
 */
export const GalleryField = ({
  files = [],
  existingImages = [],
  onFilesChange,
  onRemoveExisting,
}) => {
  const inputRef = useRef(null);

  const handlePick = (e) => {
    const picked = Array.from(e.target.files || []);
    onFilesChange([...files, ...picked]);
    e.target.value = ""; // allow picking the same file again later
  };

  const removeNewFile = (index) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {existingImages.map((img, i) => (
          <div key={img.publicId} className="relative w-20 h-20 rounded-md overflow-hidden border">
            <Image src={img.url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => onRemoveExisting(i)}
              className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {files.map((file, i) => (
          <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden border">
            <Image src={URL.createObjectURL(file)} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeNewFile(i)}
              className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-20 h-20 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-[#6b7c4d] hover:text-[#6b7c4d] transition-colors"
        >
          <ImagePlus size={20} />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handlePick}
      />
    </div>
  );
};
