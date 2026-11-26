import { experience } from "@/lib/experience";

/** Contents of the experience window. */
export function Experience() {
  return (
    <section className="p-5 font-pixel text-lg leading-tight lg:px-[3.7rem] lg:pt-[2.9rem] lg:text-[1.5rem] lg:leading-[1.5rem]">
      <h2 className="flex h-14 w-60 items-center justify-center rounded-[50%] bg-black font-scifi text-3xl text-white lg:h-[4rem] lg:w-[22rem] lg:text-[1.875rem]">
        experience
      </h2>

      <ul className="mt-6 space-y-6 lg:mt-[2.75rem] lg:space-y-[1.5rem]">
        {experience.map((job) => (
          <li key={`${job.role}-${job.org}`}>
            <h3>
              &gt;&gt; {job.role} @ {job.org}
              {job.location && ` - ${job.location}`}
            </h3>
            <p className="pl-6 lg:pl-[25.5rem]">{job.dates}</p>
            <p className="pl-4 text-[#e2332b] lg:pl-[3rem]">&lt;&lt; Skills: {job.skills}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
