import type { Metadata } from "next";
import { SynastryClient } from "./_components/SynastryClient";

export const metadata: Metadata = {
  title: "Synastry Chart Calculator | Relationship Compatibility",
  description:
    "Compare two birth charts with an interactive synastry chart calculator. See house overlays and every inter-chart aspect between two people.",
};

export default function SynastryPage() {
  return <SynastryClient />;
}
