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
const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mediaList, setMediaList] = useState<mediaRefType[]>([]);
  const listMediaRef = ref(storage, "products");


  useEffect(() => {
    listAll(listMediaRef)
      .then((res) => {
        const urls = res.items.map((item) => {
          return getDownloadURL(item);
        });
        const mediaNames = res.items.map((item) => item.name);
        return Promise.all([urls, mediaNames]);
      })
      .then(async ([urls, mediaNames]) => {
        const newMediaList = await Promise.all(
          mediaNames.map(async (name, index) => {
            const url = await urls[index];
            return {
              name,
              url,
            };
          })
        );
        setMediaList(newMediaList);
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

