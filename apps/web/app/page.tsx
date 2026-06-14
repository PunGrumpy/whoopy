import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";

import HomeImage from "./home.webp";

const WhoopMark = () => (
  <svg
    aria-hidden="true"
    className="mx-1 inline-block size-4 -translate-y-px"
    fill="currentColor"
    viewBox="0 0 39 39"
  >
    <path
      d="M18.744 35.678c-9.33 0-16.893-7.563-16.893-16.894 0-9.33 7.563-16.893 16.893-16.893 9.33 0 16.893 7.563 16.893 16.893 0 9.33-7.563 16.894-16.893 16.894zm9.4-24.086h1.943l-4.985 16.389h-1.944l-3.102-10.198h1.943l2.132 7.004 4.013-13.194zm-14.9 10.194l-3.101-10.195H8.2l3.1 10.195h1.944zm4.928-10.194l-4.987 16.389h1.943l4.987-16.389h-1.943zm.649 26.049c10.394 0 18.82-8.426 18.82-18.821C37.64 8.427 29.215 0 18.82 0S0 8.426 0 18.82s8.426 18.821 18.82 18.821z"
      transform="translate(.73 .541)"
    />
  </svg>
);

const Home = async () => {
  const session = await getSession();

  return (
    <section className="grid w-full gap-8 px-6 py-6 sm:px-12 sm:py-12 min-[1200px]:min-h-screen min-[1200px]:grid-cols-[531px_minmax(0,1fr)] min-[1200px]:items-stretch min-[1200px]:gap-[clamp(3rem,10.76vw,155px)]">
      <div className="flex flex-col gap-10 min-[1200px]:min-h-[calc(100svh-6rem)] min-[1200px]:justify-between">
        <h1 className="block shrink-0 uppercase">Whoopy</h1>

        <div className="grid max-w-xl gap-[26px]">
          <p>Welcome to Whoopy</p>

          <p>
            Whoopy is an interactive web dashboard for your <WhoopMark />
            WHOOP health data. Track your sleep performance, recovery scores,
            daily physiological strain, and exercise workouts over time with
            interactive, premium visualizations.
          </p>

          <Button
            render={<Link href={session ? "/dashboard" : "/api/auth/login"} />}
            className="h-12 rounded-full font-normal text-base"
          >
            {session ? "Go to Dashboard" : "Connect with WHOOP"}
          </Button>
        </div>
      </div>

      <div className="relative aspect-658/804 w-full overflow-hidden rounded-3xl bg-background min-[1200px]:aspect-auto min-[1200px]:h-[calc(100svh-6rem)] min-[1200px]:min-h-0">
        <Image
          className="size-full object-cover blur-[0.7px] saturate-[1.5]"
          alt="A sweet dreams"
          loading="eager"
          src={HomeImage}
          placeholder="blur"
        />
      </div>
    </section>
  );
};

export default Home;
