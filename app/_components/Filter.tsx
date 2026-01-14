"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Filter() {
  const [currentFilter, setCurrentFilter] = useState<string | null>("all");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function handleFilter(filter: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setCurrentFilter(filter);
  }

  return (
    <div className="border border-primary-800 flex">
      <button
        className={`px-5 py-2 hover:bg-primary-700 ${
          currentFilter === "all" ? "bg-primary-700" : ""
        }`}
        onClick={() => handleFilter("all")}
      >
        All cabins
      </button>
      <button
        className={`px-5 py-2 hover:bg-primary-700 ${
          currentFilter === "small" ? "bg-primary-700" : ""
        }`}
        onClick={() => handleFilter("small")}
      >
        1&mdash;3 people
      </button>
      <button
        className={`px-5 py-2 hover:bg-primary-700 ${
          currentFilter === "medium" ? "bg-primary-700" : ""
        }`}
        onClick={() => handleFilter("medium")}
      >
        4&mdash;7 people
      </button>
      <button
        className={`px-5 py-2 hover:bg-primary-700 ${
          currentFilter === "large" ? "bg-primary-700" : ""
        }`}
        onClick={() => handleFilter("large")}
      >
        8&mdash;12 people
      </button>
    </div>
  );
}
