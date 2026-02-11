export default function SampleBoxHero() {
  return (
    <section className="relative w-full bg-panda-dark text-white py-20 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-panda-yellow to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h1 className="text-[48px] md:text-[60px] font-black uppercase tracking-tight mb-4 text-panda-yellow">
          Order a Sample Box
        </h1>
        <p className="text-[18px] md:text-[20px] text-gray-200 max-w-2xl mx-auto leading-relaxed font-medium">
          Order our sample box and experience the high quality of our custom products.
        </p>
        <p className="text-[24px] font-black text-panda-yellow mt-6">
          Get 1 Sample of Each Category • Only $45
        </p>

        {/* Decorative Box Icons */}
        <div className="flex justify-center items-center gap-8 mt-12">
          <div className="text-6xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>📦</div>
          <div className="text-6xl animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '2s' }}>📦</div>
          <div className="text-6xl animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '2s' }}>📦</div>
        </div>
      </div>
    </section>
  );
}
