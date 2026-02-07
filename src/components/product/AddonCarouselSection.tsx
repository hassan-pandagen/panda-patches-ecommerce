import { client } from "@/lib/sanity";
import ProductInfoCarousel from "./ProductInfoCarousel";

async function getData() {
  const query = `*[_type == "addonOptions"][0]`;
  const data = await client.fetch(query);
  return data;
}

export default async function AddonCarouselSection() {
  const data = await getData();
  const cards = data?.cards || [];
  const title = data?.title || "Patch Add-ons Options";
  
  return <ProductInfoCarousel options={cards} title={title} layout="right" />;
}
