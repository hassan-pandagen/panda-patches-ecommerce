export default function MapSection() {
  return (
    <section className="w-full h-[450px] bg-gray-100 grayscale hover:grayscale-0 transition-all duration-700">
      <iframe 
        width="100%" 
        height="100%" 
        style={{ border: 0 }}
        loading="lazy" 
        allowFullScreen 
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3467.576829734024!2d-95.5367544237063!3d29.64434277512753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640e8eb75269707%3A0xc3913076936359d9!2s1914%20Quail%20Feather%20Ct%2C%20Missouri%20City%2C%20TX%2077489!5e0!3m2!1sen!2sus!4v1705330000000!5m2!1sen!2sus"
      ></iframe>
    </section>
  );
}
