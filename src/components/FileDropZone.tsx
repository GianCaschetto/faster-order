import { sanitizeFilename } from "@/lib/files.helpers";
import { storage } from "@/services/firebase";
import { ValidMimeTypes } from "@/types/types";
import { ref, uploadBytes } from "firebase/storage";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export type FileDropZoneProps = {
  multipleFiles: boolean;
  accept: Partial<ValidMimeTypes>;
};

export function FileDropZone({ multipleFiles, accept }: FileDropZoneProps) {
  const onDrop = useCallback((files: File[]) => {
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
      window.location.reload();
    });
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    // isDragAccept,
    // isDragReject,
  } = useDropzone({
    accept,
    onDrop,
    multiple: multipleFiles,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="cursor-pointer border-dashed border-2 w-64 h-32 rounded flex justify-center items-center">
        <span className="block text-grey">
          {isDragActive ? (
            <p>Suelta los archivos para terminar de subirlos</p>
          ) : (
            <p>
              Arrastra los archivos para subirlos <br />ó haz click aqui
            </p>
          )}
        </span>
      </div>
    </div>
  );
}
