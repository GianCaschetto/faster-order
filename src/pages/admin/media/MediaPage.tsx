import { useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "@/services/firebase";
import { FileDropZone } from "@/components/FileDropZone";
import { toast } from "react-toastify";
import { useMedia } from "@/contexts/MediaContext";

function MediaPage() {
  const { mediaList } = useMedia();
  const [showAddMediaDropzone, setShowAddMediaDropzone] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const handleSelectMedia = (url: string) => {
    if (selectedMedia.includes(url)) {
      setSelectedMedia(selectedMedia.filter((item) => item !== url));
    } else {
      setSelectedMedia([...selectedMedia, url]);
    }
  };

  const handleDeleteSelected = () => {
    const promises = selectedMedia.map((url) => {
      const fileName = mediaList.find((media) => media.url === url)?.name;
      return fileName
        ? deleteObject(ref(storage, `products/${fileName}`))
        : Promise.resolve();
    });

    Promise.all(promises)
      .then(() => {
        toast.success("Archivos eliminados correctamente");
        window.location.reload();
      })
      .catch((error) => {
        toast.error("Error al eliminar los archivos");
        console.error(error);
      });
  };

  return (
    <div>
      <button
        onClick={() => setShowAddMediaDropzone(!showAddMediaDropzone)}
        className="group relative mt-4 h-12 w-48 overflow-hidden rounded-2xl bg-slate-600 text-lg font-bold text-white"
      >
        Subir archivo
        <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
      </button>
      {showAddMediaDropzone && (
        <div className="w-full">
          <FileDropZone
            multipleFiles={true}
            accept={{
              "image/png": [".png"],
              "image/jpeg": [".jpg", ".jpeg"],
              "image/webp": [".webp"],
            }}
          />
        </div>
      )}
      {selectedMedia.length > 0 && (
        <button
          onClick={handleDeleteSelected}
          className="group relative ml-2 mt-4 h-12 w-48 overflow-hidden rounded-2xl bg-red-700 text-lg font-bold text-white"
        >
          Eliminar
          <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
        </button>
      )}
      {/* Media List */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-4 mt-4">
        {mediaList?.map((media, index) => (
          <div
            key={index}
            className="relative hover:cursor-pointer"
            onClick={() => handleSelectMedia(media.url)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(-1)}
          >
            <input
              type="checkbox"
              checked={selectedMedia.includes(media.url)}
              onChange={() => handleSelectMedia(media.url)}
              className="absolute top-2 left-2 z-10"
            />
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
                        window.location.reload();
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
