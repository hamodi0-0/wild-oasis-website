import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin } from "@/app/_lib/data-service";
import { Suspense } from "react";
import Cabin from "@/app/_components/Cabin";

// export async function generateMetadata({
//   params,
// }: {
//   params: { cabinId: number };
// }) {
//   const { cabinId } = await params;
//   const { name } = await getCabin(cabinId);

//   return {
//     title: `Cabin ${name}`,
//   };
// }

// export async function generateStaticParams() {
//   // Fetch all cabins to generate their paths
//   const cabins = await getCabins();

//   const ids = cabins.map((cabin: { id: number }) => ({
//     cabinId: String(cabin.id),
//   }));

//   return ids;
// }

export default async function Page({
  params,
}: {
  params: { cabinId: number };
}) {
  const { cabinId } = await params;

  const cabin = await getCabin(cabinId);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />
      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>

        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
