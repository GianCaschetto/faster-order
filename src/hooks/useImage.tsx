import { checkImageExists } from "@/services/firebase";
import { useEffect, useState } from "react";
import placeholderImage from "../assets/placeholder.webp";

export function useImageUrl(url: string) {
  const [imageUrl, setImageUrl] = useState<string>(url);

  useEffect(() => {
    const verifyImage = async () => {
      const exists = await checkImageExists(url);
      if (!exists) {
        setImageUrl(placeholderImage);
      }
    };

    verifyImage();
  }, [url]);

  return { imageUrl };
}
