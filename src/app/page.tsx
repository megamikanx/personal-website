import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { NavGraph } from "@/components/NavGraph";
import { Window } from "@/components/Window";
import { site } from "@/lib/site";

const PHOTO = "/photo.jpeg";
const hasPhoto = existsSync(join(process.cwd(), "public", PHOTO));

const skills = [
  ["languages", "TypeScript, JavaScript, Python, C#, C, SQL, HTML, CSS"],
  ["frontend", "React, Next.js, Tailwind CSS"],
  ["backend", "FastAPI, PostgreSQL, Supabase, Sanity CMS"],
  ["tools", "Git, Adobe Photoshop, Adobe After Effects, Blender"],
];

const linkClass = "text-link hover:underline";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col gap-8 px-4 py-10 lg:block lg:p-0">
      {/* On lg+ this is the 1440×1024 design frame (1rem = 16 design px). */}
      <div className="contents lg:relative lg:mx-auto lg:block lg:h-[64rem] lg:w-[90rem]">
        <h1 className="font-narrow text-5xl leading-none lg:absolute lg:left-[4.25rem] lg:top-[7.5rem] lg:text-[5rem]">
          hello, i&rsquo;m Stephanie <span aria-hidden>☺</span>
        </h1>

        <Window id="about" title="about me" className="lg:absolute lg:left-[4rem] lg:top-[15.75rem] lg:h-[43rem] lg:w-[61.5rem]">
          <section className="flex flex-col-reverse gap-6 p-5 font-pixel text-lg leading-tight lg:flex-row lg:justify-between lg:gap-0 lg:px-[3.2rem] lg:pt-[1.875rem] lg:text-[1.5rem] lg:leading-none">
            <div className="lg:w-[33rem]">
              <h2 className="flex h-14 w-52 items-center justify-center rounded-[50%] bg-black font-narrow text-3xl text-white lg:h-[4.0625rem] lg:w-[16.5rem] lg:text-[2.25rem]">
                about me
              </h2>

              <div className="mt-6 space-y-6 lg:mt-[1.75rem] lg:space-y-[1.5rem]">
                <p>
                  &gt;&gt; I&rsquo;m a full-stack developer based in Melbourne. I love
                  building software that feels personal and useful, and turning
                  inconveniences into things people actually enjoy using.
                  <br />
                  <a href={site.resume} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    &gt;&gt; Here&rsquo;s my resume!
                  </a>
                </p>

                <div>
                  <h3>&gt;&gt; Education</h3>
                  <p>BSc in Computing and Software Systems</p>
                  <p className="text-right">Feb 2024 - Nov 2026 (University of Melbourne)</p>
                </div>

                <div>
                  <h3>&gt;&gt; Skills</h3>
                  <dl>
                    {skills.map(([group, items]) => (
                      <div key={group}>
                        <dt className="pl-4 lg:pl-[1.375rem]">&lt;&lt; {group}</dt>
                        <dd className="pl-10 lg:pl-[4.5rem]">{items}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>

            <div className="w-full max-w-sm self-start border-[0.3rem] border-dotted border-black bg-white p-[0.35rem] lg:mt-[1.375rem] lg:w-[17.7rem]">
              <div className="relative aspect-[736/414] w-full bg-neutral-200">
                {hasPhoto && (
                  <Image src={PHOTO} alt="" fill sizes="(min-width: 1024px) 20vw, 384px" className="object-contain" />
                )}
              </div>
            </div>
          </section>
        </Window>

        <Window
          id="connect"
          title="let's connect"
          compact
          initialZ={2}
          className="lg:absolute lg:left-[45rem] lg:top-[37.5rem] lg:h-[18.75rem] lg:w-[26.75rem] lg:shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.12)]"
        >
          <section className="space-y-4 p-5 font-pixel text-lg leading-tight lg:space-y-[1.5rem] lg:px-[2.2rem] lg:pt-[1.6rem] lg:text-[1.5rem] lg:leading-none">
            <h2>
              Let&rsquo;s connect! <span aria-hidden>⋆｡°✩ &nbsp; ° ｡⋆ &nbsp; ✩⋆˙</span>
            </h2>
            <p>
              <a href={`mailto:${site.email}`} className={linkClass}>
                &gt;&gt; Contact me
              </a>
            </p>
            <p>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                &gt;&gt; LinkedIn
              </a>
            </p>
          </section>
        </Window>

        <NavGraph />
      </div>
    </main>
  );
}
