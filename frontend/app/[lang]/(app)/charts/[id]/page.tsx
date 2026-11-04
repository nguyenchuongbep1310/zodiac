import type { Metadata } from "next";
import { ChartViewerClient } from "./_components/ChartViewerClient";

export const metadata: Metadata = {
  title: "Natal Chart",
  description: "View your natal chart with planetary positions, houses, and aspects.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ChartPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChartViewerClient id={id} />;
}
