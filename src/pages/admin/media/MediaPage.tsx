import { useEffect, useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "@/services/firebase";
import { FileDropZone } from "@/components/FileDropZone";
import { toast } from "react-toastify";
import { useMedia } from "@/contexts/MediaContext";
import { mediaRefType } from "@/types/types";

function MediaPage() {
  const { mediaList } = useMedia();
  const [showAddMediaDropzone, setShowAddMediaDropzone] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };



  return (
    <div>
      <button onClick={() => setShowAddMediaDropzone(!showAddMediaDropzone)}>
        Agregar un nuevo archivo
      </button>
      {showAddMediaDropzone && (
        <div className="w-full">
          <FileDropZone
            multipleFiles
            accept={{
              "image/png": [".png"],
              "image/jpeg": [".jpg", ".jpeg"],
              "image/webp": [".webp"],
            }}
          />
        </div>
      )}
      {/* Media List */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-4">
        {mediaList?.map((media, index) => (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(-1)}
          >
            <img
              className="h-auto max-w-full rounded-lg shadow-md object-cover"
              src={media.url}
              alt={media.name}
            />
            {hoveredIndex === index && (
              <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-lg">
                <button
                  onClick={() => {
                    copyUrl(media.url);
                  }}
                  className="text-white hover:text-gray-300 mr-2"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-copy"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
                    <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    deleteObject(ref(storage, `products/${media.name}`)).then(
                      () => {
                        toast.success("Archivo eliminado correctamente");
                      }
                    );
                  }}
                  className="text-white hover:text-gray-300"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 7l16 0" />
                    <path d="M10 11l0 6" />
                    <path d="M14 11l0 6" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MediaPage;
