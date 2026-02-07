"use client";

import Image from "next/image";

const steps = [
  {
    id: 1,
    label: "Step 1",
    title: "SKETCH",
    image: "/assets/process-sketch.png",
    alt: "Sketch Design",
  },
  {
    id: 2,
    label: "Step 2",
    title: "MOCKUP",
    image: "/assets/process-mockup.png",
    alt: "Digital Mockup",
  },
  {
    id: 3,
    label: "Step 3",
    title: "PATCH",
    image: "/assets/process-patch.png",
    alt: "Final Patch",
  },
];

export default function ProcessSteps() {
  return (
    <section className="w-full py-24 bg-[#F9FAF5]">
      <div className="container mx-auto px-4 text-center">
        
        {/* === HEADINGS === */}
        <div className="mb-20 space-y-4">
          <h2 className="text-[40px] font-black text-panda-dark uppercase tracking-tight leading-tight">
            TAKE THE FIRST STEP ON YOUR <br /> PATCH QUEST!
          </h2>
          <p className="text-[17px] text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Step into an adventure where ordering custom patches is as easy as 1-2-3. 
            In just three simple steps, witness your unique patch designs!
          </p>
        </div>

        {/* === 3 STEPS GRID === */}
        <div className="flex flex-wrap justify-center gap-12 lg:gap-16">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              
              {/* Step Indicator (Circle + Text) */}
              <div className="flex flex-col items-center mb-6">
                <span className="text-[18px] font-bold text-panda-dark mb-2">
                  {step.label}
                </span>
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-panda-yellow font-bold text-lg shadow-md">
                  {step.id}
                </div>
              </div>

              {/* 
                 IMAGE CARD 
                 - Width: 416px, Height: 416px (Exact Figma)
                 - Rounded corners
                 - Shadow
              */}
              <div className="relative w-[416px] h-[416px] rounded-[24px] overflow-hidden shadow-2xl bg-white group hover:scale-[1.02] transition-transform duration-500">
                
                {/* The Image */}
                <Image 
                  src={step.image} 
                  alt={step.alt}
                  fill
                  className="object-cover"
                />

                {/* 
                   THE YELLOW BAR OVERLAY 
                   - Position: Absolute bottom
                   - Width: Full
                */}
                <div className="absolute bottom-8 left-0 right-0 px-6">
                  <div className="w-full bg-panda-yellow py-3 text-center rounded-lg shadow-sm">
                    <span className="text-black font-black uppercase tracking-widest text-sm">
                      {step.title}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
