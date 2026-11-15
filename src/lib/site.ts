export const site = {
  name: "Stephanie Min",
  email: "stephanie.min5240@gmail.com",
  linkedin: "https://www.linkedin.com/in/stephanie-sy-min/",
  github: "https://github.com/megamikanx",
  resume: "/resume.pdf",
};

/**
 * Nodes of the navigation graph on the home page.
 * x / y / r are in design pixels on the 1440×1024 Figma frame.
 */
export const navNodes = [
  { label: "experience", href: "/experience", x: 1038, y: 109, r: 40 },
  { label: "projects", href: "/projects", x: 1264, y: 322, r: 26 },
  { label: "blog", href: "/blog", x: 1136, y: 518, r: 25 },
  { label: "github", href: site.github, x: 1194, y: 698, r: 37 },
] as const;
