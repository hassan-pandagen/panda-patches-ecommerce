import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  currentPage: string;
}

export default function Breadcrumbs({ items, currentPage }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="w-full pt-2 pb-2 px-4 md:px-6">
      <div className="container mx-auto max-w-[1200px] 2xl:max-w-[1320px] 3xl:max-w-[1440px] 4xl:max-w-[1536px]">
        <ol className="flex items-center gap-2 text-sm md:text-base">
          {/* Breadcrumb Items — every caller already passes "Home" as items[0],
              so this no longer hardcodes its own Home link (was rendering
              "Home > Home > ..." on all 27 pages that use this component). */}
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
              <Link
                href={item.href}
                className="text-gray-500 hover:text-panda-green transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Current Page */}
          <li className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-panda-dark font-semibold">{currentPage}</span>
          </li>
        </ol>
      </div>
    </nav>
  );
}
