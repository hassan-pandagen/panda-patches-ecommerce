import { client } from "@/lib/sanity";
import ProductInfoCarousel from "./ProductInfoCarousel";

async function getData() {
  const query = `*[_type == "threadOptions"][0]`;
  const data = await client.fetch(query);
  return data;
}

export default async function ThreadCarouselSection() {
  const data = await getData();
  const cards = data?.cards || [];
  const title = data?.title || "Patch Thread Options";
  
  return <ProductInfoCarousel options={cards} title={title} layout="left" />;
}
