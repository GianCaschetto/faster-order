import { sanitizeFilename } from "@/lib/files.helpers";
import { storage } from "@/services/firebase";
import { ValidMimeTypes } from "@/types/types";
import { ref, uploadBytes } from "firebase/storage";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export type FileDropZoneProps = {
  multipleFiles: boolean;
  accept: Partial<ValidMimeTypes>;
};

export function FileDropZone({ multipleFiles, accept }: FileDropZoneProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((files: File[]) => {
    setIsUploading(true);
    const uploadPromises = files.map((file) => {
      const sanitizedFileName = sanitizeFilename(file.name);
      if (!sanitizedFileName) return Promise.resolve();

      const photoRef = ref(storage, `products/${sanitizedFileName}`);
      const newFile = new File([file], sanitizedFileName, { type: file.type });

      return uploadBytes(photoRef, newFile).catch((error) => {
        console.error(`Error al subir el archivo ${sanitizedFileName}`);
        console.error(error.message);
      });
    });

    Promise.all(uploadPromises).then(() => {
      setIsUploading(false);
      window.location.reload();
    });
  }, []);

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept,
    onDrop,
    multiple: multipleFiles,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="flex items-center justify-center w-full mt-2">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.2 1.45A8 8 0 018 4.058V0C3.588 0 0 3.588 0 8a8 8 0 006 7.291z"></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Subiendo archivos...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click para subir</span> o arrastra y suelta
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG, WEBP
              </p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}
