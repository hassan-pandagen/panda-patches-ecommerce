import { client } from "@/lib/sanity";
import ProductInfoCarousel from "./ProductInfoCarousel";

async function getData() {
  const query = `*[_type == "borderOptions"][0]`;
  const data = await client.fetch(query);
  return data;
}

export default async function BorderCarouselSection() {
  const data = await getData();
  
  // Use fallback if no data
  const cards = data?.cards || [];
  const title = data?.title || "Patch Border Options";
  const subtitle = data?.subtitle || "Patch Embroidered Patch";

  return (
    <ProductInfoCarousel 
      options={cards} 
      title={title} 
      subtitle={subtitle}
      layout="right"
    />
  );
}
