import { client } from "@/lib/sanity";
import ProductInfoCarousel from "./ProductInfoCarousel";

async function getData() {
  try {
    const query = `*[_type == "patchOption"]`;
    const data = await client.fetch(query);
    return data || [];
  } catch (error) {
    console.error("Error fetching patch options:", error);
    return [];
  }
}

export default async function InfoCarouselSection() {
  const data = await getData();
  return <ProductInfoCarousel options={Array.isArray(data) ? data : []} />;
}
