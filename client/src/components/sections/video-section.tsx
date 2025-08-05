import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function VideoSection() {
  const [hasVideoError, setHasVideoError] = useState(false);

  // Запрашиваем видео из базы данных
  const { data: hasVideo, isLoading } = useQuery({
    queryKey: ["/api/background-video"],
    queryFn: async () => {
      const response = await fetch("/api/background-video");
      if (response.ok) {
        return true;
      }
      return false;
    },
    retry: false,
  });

  const videoSrc = hasVideo && !hasVideoError ? "/api/background-video" : null;

  return (
    <section className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center">
      {/* Background texture for when video is not loaded */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('null')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "invert(1) contrast(2)",
        }}
      />

      {/* Video overlay */}
      {videoSrc && !isLoading && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={(e) => {
            const video = e.target as HTMLVideoElement;
            console.log("Video loaded, duration:", video.duration);
            video.play().catch((error) => {
              console.log("Video play failed:", error);
            });
          }}
          onPlay={() => console.log("Video started playing")}
          onPause={() => console.log("Video paused")}
          onError={(e) => {
            console.log("Video error:", e);
            setHasVideoError(true);
          }}
          onLoadStart={() => console.log("Video loading started")}
          onCanPlay={() => console.log("Video can play")}
        >
          <source src={videoSrc} type="video/mp4" />
          <source src={videoSrc} type="video/webm" />
        </video>
      )}

      <div className="relative z-10 text-center text-white">
        <h2 className="text-50 font-extrabold mb-4">В Процессе Работы</h2>
        <p className="text-24 font-regular">Создание. Инновации. Результат.</p>
      </div>
    </section>
  );
}
