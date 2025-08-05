import { useQuery } from "@tanstack/react-query";
import type { VideoFile } from "@shared/schema";

export default function VideoSection() {
  const { data: activeVideo } = useQuery<VideoFile>({
    queryKey: ["/api/videos/active"],
  });

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
      {activeVideo && (
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
            const video = e.target as HTMLVideoElement;
            video.style.display = "none"; // Hide failed video
          }}
          onLoadStart={() => console.log("Video loading started")}
          onCanPlay={() => console.log("Video can play")}
        >
          <source src={`/uploads/videos/${activeVideo.fileName}`} type={activeVideo.mimeType} />
        </video>
      )}

      <div className="relative z-10 text-center text-white">
        <h2 className="text-50 font-extrabold mb-4">В Процессе Работы</h2>
        <p className="text-24 font-regular">Создание. Инновации. Результат.</p>
      </div>
    </section>
  );
}
