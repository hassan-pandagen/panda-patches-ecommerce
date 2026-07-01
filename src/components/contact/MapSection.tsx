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
        src="https://maps.google.com/maps?q=701%20Tillery%20St%20Ste%2012%2C%20Austin%2C%20TX%2078702&t=&z=15&ie=UTF8&iwloc=&output=embed"
      ></iframe>
    </section>
  );
}
