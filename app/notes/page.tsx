import Image from "next/image";

export default function NotesPage() {
  const photos = [
    { src: "/Bhunu photo 1.jpeg", alt: "Bhuni Photo 1", rotation: "-rotate-2" },
    { src: "/Bhunu photo 2.jpeg", alt: "Bhuni Photo 2", rotation: "rotate-3" },
    { src: "/Bhunu photo 3.jpeg", alt: "Bhuni Photo 3", rotation: "-rotate-1" },
  ];

  return (
    <div className="flex flex-col items-center max-w-5xl w-full mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="text-center mt-8 mb-12">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-rose-900 mb-6 drop-shadow-sm">
          Love Notes & Whispers for My Bhuni 💌
        </h1>
        
        <div className="glass-card p-6 md:p-10 rounded-3xl max-w-3xl mx-auto relative group">
          <div className="absolute top-4 left-4 text-4xl text-rose-300 opacity-50 font-serif">"</div>
          <p className="font-serif text-lg md:text-2xl text-rose-800 leading-relaxed md:leading-loose text-center italic relative z-10">
            To my sweetest, cutest, and most caring Bhuni — you may be short in height, but you fill every corner of my world with the biggest love imaginable. From your adorable smile to the gentle way you care for everyone around you, you are truly one of a kind. This space is just a tiny reflection of how deeply loved and cherished you are every single day. Happy Birthday Month, my love! 💖
          </p>
          <div className="absolute bottom-[-10px] right-4 text-4xl text-rose-300 opacity-50 font-serif">"</div>
        </div>
      </header>

      <div className="w-full mt-8 md:mt-12">
        <h2 className="font-sans text-sm md:text-base font-semibold text-rose-800 uppercase tracking-widest text-center mb-10 opacity-80">
          Memories We Treasure
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 px-4">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className={`bg-white p-3 md:p-4 pb-12 md:pb-16 rounded-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 cursor-pointer ${photo.rotation} hover:rotate-0 group border border-gray-100`}
            >
              <div className="relative aspect-square w-full rounded-sm overflow-hidden bg-gray-50">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-rose-200 mix-blend-overlay opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center font-serif text-rose-900/60 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                My Cutie ✨
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
