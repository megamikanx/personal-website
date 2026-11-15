import Link from "next/link";
import { navNodes } from "@/lib/site";

const rem = (px: number) => `${px / 16}rem`;

function NodeLink({
  href,
  className,
  style,
  children,
}: {
  href: string;
  className: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
}

/** Constellation of linked circles on large screens; a simple row on small ones. */
export function NavGraph() {
  return (
    <nav aria-label="Main">
      {/* large screens: positioned on the design frame */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 1440 1024"
          aria-hidden
        >
          <polyline
            points={navNodes.map((n) => `${n.x},${n.y}`).join(" ")}
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
        {navNodes.map((n) => (
          <NodeLink
            key={n.label}
            href={n.href}
            style={{ left: rem(n.x), top: rem(n.y) }}
            className="group pointer-events-auto absolute flex -translate-y-1/2 items-center font-thonburi text-[1.625rem]"
          >
            <span
              className="absolute top-1/2 -translate-y-1/2 rounded-full bg-white transition-transform duration-200 group-hover:scale-110"
              style={{ width: rem(n.r * 2), height: rem(n.r * 2), left: rem(-n.r) }}
            />
            <span
              className="transition-transform duration-200 group-hover:translate-x-[0.25rem]"
              style={{ marginLeft: rem(n.r + 16) }}
            >
              {n.label}
            </span>
          </NodeLink>
        ))}
      </div>

      {/* small screens */}
      <ul className="flex flex-wrap gap-x-6 gap-y-3 lg:hidden">
        {navNodes.map((n) => (
          <li key={n.label}>
            <NodeLink
              href={n.href}
              className="flex items-center gap-2 font-thonburi text-lg"
            >
              <span className="size-6 rounded-full bg-white" />
              {n.label}
            </NodeLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
