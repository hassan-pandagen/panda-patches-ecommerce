import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";

interface TimelineStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

interface TimelineData {
  heading?: string;
  steps?: TimelineStep[];
  imageLeft?: any; // Sanity image type
  imageRight?: any; // Sanity image type
}

async function getTimelineData(): Promise<TimelineData | null> {
  const query = `*[_type == "timeline"][0]`;
  const data = await client.fetch(query);
  return data;
}

export default async function TimelineSection() {
  const sanityData = await getTimelineData();

  const steps: TimelineStep[] = sanityData?.steps || [
    { 
      number: "1", 
      title: "Let's Get Started!", 
      subtitle: "Quick, easy, and convenient",
      description: "Ready to order custom patches? Get started in just a few steps—use our quote form or chat with our patch experts today!" 
    },
    { 
      number: "2", 
      title: "Sample Of Your Perfect Patch", 
      subtitle: "We Want You to Love It",
      description: "Your satisfaction comes first! After your order, we'll send a sample patch and refine it until it's perfect." 
    },
    { 
      number: "3", 
      title: "The Production Brings!", 
      subtitle: "We Turn Ideas into Reality",
      description: "After approval, our skilled team begins production with attention to every detail. In a hurry? We also offer rush orders." 
    },
    { 
      number: "4", 
      title: "Delivery at Your Doorstep", 
      subtitle: "Ready to Be Impressed with apparel panda patches?",
      description: "Ready to order custom patches? Get started in just a few steps—use our quote form or chat with our patch experts today!" 
    },
  ];

  const title = sanityData?.heading || "ORDERING IRON ON PATCHES MADE SIMPLE AND EXCITING!";
  
  const imgLeft = sanityData?.imageLeft ? urlFor(sanityData.imageLeft).url() : "/assets/timeline-1.png";
  const imgRight = sanityData?.imageRight ? urlFor(sanityData.imageRight).url() : "/assets/timeline-2.png";

  return (
    <section className="w-full pt-12 pb-6 bg-white overflow-visible font-sans">
      <div className="container mx-auto px-4 max-w-[1250px]">
        
        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-[24px] md:text-[32px] lg:text-[38px] font-black text-panda-dark uppercase tracking-tight leading-tight max-w-3xl mx-auto">
            {title}
          </h2>
          <p className="text-[16px] text-gray-600 mt-3 font-medium max-w-2xl mx-auto">
            After helping thousands of customers now we have cracked the best way to help a customer order 100% hassle free!
          </p>
        </div>

        {/* === UNIFIED TIMELINE === */}
        <div className="relative">
          
          {/* MOBILE VIEW (Stacked) */}
          <div className="lg:hidden flex flex-col gap-10">
             <div className="flex justify-center mb-4">
                <div className="relative w-[300px] h-[250px]">
                   <Image src={imgLeft} alt="Collage 1" fill className="object-contain" sizes="300px" quality={85} />
                </div>
             </div>
             {steps.slice(0, 2).map((step: TimelineStep, index: number) => (
               <TimelineStep key={index} step={step} align="left" mobile />
             ))}
             <div className="flex justify-center my-4">
                <div className="relative w-[300px] h-[250px]">
                   <Image src={imgRight} alt="Collage 2" fill className="object-contain" sizes="300px" quality={85} />
                </div>
             </div>
             {steps.slice(2, 4).map((step: TimelineStep, index: number) => (
               <TimelineStep key={index + 2} step={step} align="right" mobile />
             ))}
          </div>

          {/* DESKTOP VIEW (3-Column Grid) */}
          <div className="hidden lg:grid grid-cols-[1fr_80px_1fr] gap-y-0 relative">
            
            {/* STEP 1 */}
            <div className="flex justify-end items-center pr-10 row-span-2">
               <div className="relative w-[480px] h-[380px]">
                  <Image src={imgLeft} alt="Collage 1" fill className="object-contain" sizes="(max-width: 1024px) 300px, 480px" quality={90} priority />
               </div>
            </div>
            <div className="flex justify-center items-start pt-2 z-10 relative">
               <div className="absolute top-[32px] bottom-0 w-[3.5px] bg-[#E3FF15] left-1/2 -translate-x-1/2 z-0"></div>
               <TimelineMarker number={steps[0].number} />
            </div>
            <div className="flex justify-start items-start pt-2 pl-10">
               <TimelineStepContent step={steps[0]} align="left" />
            </div>

            {/* STEP 2 */}
            <div className="flex justify-center items-start pt-2 z-10 relative">
               <div className="absolute top-0 bottom-0 w-[3.5px] bg-[#E3FF15] left-1/2 -translate-x-1/2 z-0"></div>
               <TimelineMarker number={steps[1].number} />
            </div>
            <div className="flex justify-start items-start pt-2 pl-10">
               <TimelineStepContent step={steps[1]} align="left" />
            </div>

            {/* STEP 3 (Now even closer) */}
            <div className="flex justify-end items-start pt-0 pr-10 text-right -mt-6">
               <TimelineStepContent step={steps[2]} align="right" />
            </div>
            <div className="flex justify-center items-start pt-0 z-10 relative -mt-6">
               <div className="absolute top-0 bottom-0 w-[3.5px] bg-[#E3FF15] left-1/2 -translate-x-1/2 z-0"></div>
               <TimelineMarker number={steps[2].number} />
            </div>
            <div className="flex justify-start items-center pl-10 row-span-2 pt-0 -mt-20">
               <div className="relative w-[420px] h-[320px]">
                  <Image src={imgRight} alt="Collage 2" fill className="object-contain" sizes="(max-width: 1024px) 300px, 420px" quality={90} priority />
               </div>
            </div>

            {/* STEP 4 */}
            <div className="flex justify-end items-start pt-2 pr-10 text-right -mt-4">
               <TimelineStepContent step={steps[3]} align="right" />
            </div>
            <div className="flex justify-center items-start pt-2 z-10 relative -mt-4">
               <div className="absolute top-0 h-[32px] w-[3.5px] bg-[#E3FF15] left-1/2 -translate-x-1/2 z-0"></div>
               <TimelineMarker number={steps[3].number} />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

// === TIMELINE MARKER (Black Circle) ===
function TimelineMarker({ number }: { number: string }) {
  return (
    <div className="w-[60px] h-[60px] bg-black rounded-full flex items-center justify-center text-panda-yellow font-black text-2xl border-[5px] border-white shadow-lg z-10">
      {number}
    </div>
  );
}

// === TIMELINE STEP CONTENT (Text & Watermark) ===
function TimelineStepContent({ step, align }: { step: TimelineStep; align: 'left' | 'right' }) {
  const isRight = align === 'right';

  return (
    <div className={`relative ${isRight ? 'text-right' : 'text-left'} w-full max-w-[480px]`}>
      {/* Watermark Number */}
      <div className={`
        absolute text-[120px] font-black leading-none select-none
        text-gray-150 opacity-10 -z-10
        ${isRight ? 'right-0' : 'left-0'}
        -top-12
      `}>
        {step.number}
      </div>

      <div className="relative z-10">
         <h3 className="text-[26px] font-black text-panda-dark mb-1 leading-tight">
           {step.title}
         </h3>
         <p className="text-[18px] font-bold text-black mb-2 leading-tight">
           {step.subtitle}
         </p>
         <p className="text-[15px] text-gray-600 leading-[1.6] font-medium">
           {step.description}
         </p>
      </div>
    </div>
  );
}

// === ORIGINAL STACKED STEP (For Mobile) ===
function TimelineStep({ step, align, mobile }: { step: TimelineStep; align: 'left' | 'right'; mobile?: boolean }) {
  const isRight = align === 'right';

  return (
    <div className={`relative flex items-start gap-4 ${isRight && !mobile ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
      <div className="flex-shrink-0 w-[55px] h-[55px] bg-black rounded-full flex items-center justify-center text-panda-yellow font-black text-xl border-4 border-white shadow-md">
        {step.number}
      </div>
      <div className="pt-1">
        <h3 className="text-[22px] font-black text-panda-dark leading-tight">{step.title}</h3>
        <p className="text-[17px] font-bold text-black mb-1">{step.subtitle}</p>
        <p className="text-[14px] text-gray-600 leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
}
