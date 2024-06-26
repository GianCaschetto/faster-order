import { useMedia } from "@/contexts/MediaContext";

function MediaModal({ isOpen, onClose, setImageSelected }) {
  const { mediaList } = useMedia();
  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 w-3/4">
            <h1 className="text-2xl font-bold">Media</h1>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 overflow-y-auto object-cover">
              {mediaList.map((media) => (
                <div key={crypto.randomUUID()} className="h-full max-w-full ">
                  <img
                    src={media.url}
                    alt={media.name}
                    onClick={() => {
                      setImageSelected(media.url);
                      onClose();
                    }}
                    className="w-28 h-28 object-cover cursor-pointer hover:shadow-lg transition duration-300 ease-in-out"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={onClose}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mx-auto block"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaModal;
