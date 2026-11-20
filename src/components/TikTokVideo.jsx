export default function TikTokVideo({ id }) {
  return (
    <div className="tt-video">
      <iframe
        src={`https://www.tiktok.com/player/v1/${id}?music_info=0&description=0&rel=0`}
        title="Eleven B Site Sense project video on TikTok"
        loading="lazy"
        allow="fullscreen; encrypted-media"
        allowFullScreen
      />
    </div>
  )
}
