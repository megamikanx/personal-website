import Link from "next/link";
import { Window } from "@/components/Window";

export function ComingSoon({ title }: { title: string }) {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-8 px-4 py-10 lg:text-[1rem]">
      <h1 className="font-narrow text-5xl leading-none">{title}</h1>
      <Window id="page" title={title}>
        <div className="space-y-4 p-6 font-pixel text-xl leading-tight">
          <p>&gt;&gt; coming soon ⋆｡°✩</p>
          <p>
            <Link href="/" className="text-link hover:underline">
              &lt;&lt; back home
            </Link>
          </p>
        </div>
      </Window>
    </main>
  );
}
