import { useQuery } from "@tanstack/react-query";
import type { Setting } from "@shared/schema";

export default function VideoSection() {
  const { data: videoSetting } = useQuery<Setting>({
    queryKey: ["/api/settings/backgroundVideo"],
  });

  return (
    <section className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center">
      {/* Background texture for when video is not loaded */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'invert(1) contrast(2)'
        }}
      />
      
      {/* Video overlay */}
      {videoSetting?.value && (
        <video 
          className="absolute inset-0 w-full h-full object-cover" 
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => {
            const video = e.target as HTMLVideoElement;
            console.log("Video loaded, duration:", video.duration);
            video.play().catch(console.log);
          }}
          onPlay={() => console.log("Video started playing")}
          onPause={() => console.log("Video paused")}
          onError={(e) => console.log("Video error:", e)}
        >
          <source src={videoSetting.value} type="video/mp4" />
        </video>
      )}
      
      <div className="relative z-10 text-center text-white">
        <h2 className="text-50 font-extrabold mb-4">В Процессе Работы</h2>
        <p className="text-24 font-regular">Создание. Инновации. Результат.</p>
      </div>
    </section>
  );
}
