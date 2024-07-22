import { X } from "lucide-react";

function ImageModal({
  imageUrl,
  altText,
  closeImageModal,
}: {
  imageUrl: string;
  altText: string;
  closeImageModal: () => void;
}) {
  return (
    <div className="z-20 fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center">
      <button
        onClick={closeImageModal}
        className="absolute top-4 right-4 text-white text-2xl"
      >
        <X size={30} />
      </button>
      <img src={imageUrl} alt={altText} className="max-w-full max-h-full" />
    </div>
  );
}

export default ImageModal;
