import { storage } from "@/services/firebase";
import { mediaRefType } from "@/types/types";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { useContext, useState, createContext, useEffect } from "react";

type MediaContextType = {
  mediaList: mediaRefType[];
};

//Create context media
export const MediaContext = createContext<MediaContextType | null>(null);

//Create provider media
const MediaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mediaList, setMediaList] = useState<mediaRefType[]>([]);
  const listMediaRef = ref(storage, "products");

  useEffect(() => {
    listAll(listMediaRef).then((res) => {
      const newMediaList = res.items.map(async (folderRef) => {
        return {
          name: folderRef.name,
          url: await getDownloadURL(folderRef),
        };
      });
      Promise.all(newMediaList).then((res) => {
        setMediaList(res);
      });
    });
  }, []);

  return (
    <MediaContext.Provider value={{ mediaList }}>
      {children}
    </MediaContext.Provider>
  );
};

//Use context media
export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
};

export default MediaProvider;
