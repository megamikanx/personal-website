import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "blog · Stephanie Min" };

export default function BlogPage() {
  return <ComingSoon title="blog" />;
}
