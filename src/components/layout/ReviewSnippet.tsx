const REVIEWS = [
  {
    quote: "The quality is outstanding, durable, vibrant, and exactly what I envisioned. Their customer service didn't stop after delivery. I highly recommend them!",
    name: "Selena P.",
    location: "US",
    initials: "SP",
    color: "bg-purple-500",
  },
  {
    quote: "Impressively on time with both delivery and service. The quality of the material was excellent. I would recommend Panda Patches for anyone looking for reliable service.",
    name: "Taye S.",
    location: "US",
    initials: "TS",
    color: "bg-teal-500",
  },
  {
    quote: "They make the greatest patch work I've seen. They are trustworthy and I have not once messaged them that they haven't messaged me back that same day or early the next.",
    name: "Javier P.",
    location: "US",
    initials: "JP",
    color: "bg-orange-500",
  },
];

export default function ReviewSnippet() {
  return (
    <div className="w-full py-8 bg-gray-50 border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="text-center mb-6">
          <h2 className="text-[16px] font-black text-gray-800">What Our Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-white rounded-[14px] p-5 border border-gray-100 shadow-sm">
              <p className="text-[13px] text-gray-600 leading-[1.7] mb-4 line-clamp-3">&ldquo;{r.quote}&rdquo;</p>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${r.color} flex items-center justify-center text-white text-[11px] font-black flex-shrink-0`}>
                  {r.initials}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-800">{r.name}</p>
                  <p className="text-[11px] text-gray-400">{r.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
