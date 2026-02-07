import { client } from "@/lib/sanity";
import PatchTypes from "./PatchTypes";

async function getData() {
  const query = `*[_type == "patchTypes"] | order(_createdAt asc)`;
  const data = await client.fetch(query);
  return data;
}

export default async function PatchTypesSection() {
  const data = await getData();
  return <PatchTypes types={data} />;
}
