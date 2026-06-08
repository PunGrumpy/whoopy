import Image from "next/image";

import { WhoopMark } from "@/components/whoop-mark";

import HomeImage from "./home.webp";

const Home = () => (
  <section className="grid w-full gap-8 px-6 py-6 sm:px-12 sm:py-12 min-[1200px]:min-h-screen min-[1200px]:grid-cols-[531px_minmax(0,1fr)] min-[1200px]:items-stretch min-[1200px]:gap-[clamp(3rem,10.76vw,155px)]">
    <div className="flex flex-col gap-10 min-[1200px]:min-h-[calc(100svh-6rem)] min-[1200px]:justify-between">
      <WhoopMark className="size-8 md:size-12 shrink-0 text-background" />

      <div className="grid max-w-xl gap-[26px]">
        <p>Welcome to Whoopy</p>

        <p>Whoopy is a interactive dashboard for WHOOP data via API.</p>
      </div>
    </div>

    <div className="relative aspect-658/804 w-full overflow-hidden rounded-3xl bg-background min-[1200px]:aspect-auto min-[1200px]:h-[calc(100svh-6rem)] min-[1200px]:min-h-0">
      <Image
        className="size-full object-cover blur-[0.7px] saturate-[1.5]"
        alt="A sweet dreams"
        {...HomeImage}
      />
    </div>
  </section>
);

export default Home;
