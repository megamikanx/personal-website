import type { Metadata } from "next";
import Link from "next/link";
import { Experience } from "@/components/Experience";
import { Window } from "@/components/Window";

export const metadata: Metadata = { title: "experience · Stephanie Min" };

/** Direct-link version of the experience window on the home page. */
export default function ExperiencePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-[66rem] flex-col justify-center gap-6 px-4 py-10">
      <Window id="experience-page" title="experience">
        <Experience />
        <p className="px-5 pb-6 font-pixel text-lg lg:px-[3.9rem] lg:text-[1.375rem]">
          <Link href="/" className="text-link hover:underline">
            &lt;&lt; back home
          </Link>
        </p>
      </Window>
    </main>
  );
}
