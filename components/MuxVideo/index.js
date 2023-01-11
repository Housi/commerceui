import React, { useEffect, useRef, useState } from 'react'
import Image from '../Image'
import Hls from 'hls.js'

const MuxVideo = ({ file }) => {
  const videoRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    let hls
    if (videoRef.current) {
      setLoaded(true)
      const video = videoRef.current

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Some browers (safari and ie edge) support HLS natively
        video.src = src
      } else if (Hls.isSupported()) {
        // This will run in all other modern browsers
        hls = new Hls()
        hls.loadSource(src)
        hls.attachMedia(video)
      } else {
        console.error("This is a legacy browser that doesn't support MSE")
      }
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
    }
  }, [videoRef])

  const PLAYBACK_ID = file.playbackId

  const RATIO = file.ratio.split(':')

  // console.log(video.data.video.file)

  const src = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`

  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: (RATIO[1] / RATIO[0]) * 100 + '%' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Image
          image={{
            src: `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg`
          }}
          layout={'fill'}
        />
      </div>
      <video
        ref={videoRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  )
}

export default MuxVideo
