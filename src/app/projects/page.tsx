import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "projects · Stephanie Min" };

export default function ProjectsPage() {
  return <ComingSoon title="projects" />;
}
