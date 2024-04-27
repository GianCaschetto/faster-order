import { useMedia } from '@/contexts/MediaContext';
import React from 'react'

function MediaModal({ isOpen, onClose, setImageSelected}) {
    const { mediaList } = useMedia();
  return (
    <div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 w-3/4">
            <h1 className="text-2xl font-bold">Media</h1>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 overflow-y-auto object-cover">
              {mediaList.map((media) => (
                <div key={crypto.randomUUID()} className="h-auto max-w-full" onClick={()=>{
                  setImageSelected(media.url)
                  onClose()
                }}>
                  <img src={media.url} alt={media.name} className="w-full h-32 object-cover"
                   />
                </div>
              ))}
            </div>
            <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )
      }
    </div>
  );
}

export default MediaModal