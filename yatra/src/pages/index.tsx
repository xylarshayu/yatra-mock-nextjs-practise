import Image from "next/image";
import { useRouter } from "next/router";
import cities from "@/data/cities.json";
import { SearchHotelsParams } from "@/types";

export default function Home() {
  return (
    <div>
      <main className="max-w-maxwidth min-h-page-height mx-auto py-8 items-center">
        <h1 className="text-4xl font-bold text-center mb-8">Find My Hotel</h1>
        <p className="text-center text-gray-500 max-w-[60ch] mx-auto">
          Discover amazing hotels and create unforgettable memories with our curated selection of accommdations.
        </p>
      </main>
    </div>
  );
}
