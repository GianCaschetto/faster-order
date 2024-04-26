import { useMedia } from '@/contexts/MediaContext';
import React from 'react'

function MediaModal() {
    const { mediaList } = useMedia();
    console.log(mediaList)
  return (
    <div>MediaModal</div>
  )
}

export default MediaModal