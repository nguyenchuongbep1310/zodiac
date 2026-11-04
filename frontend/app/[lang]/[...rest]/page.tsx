import { notFound } from "next/navigation";

// Unknown paths inside a locale render that locale's not-found page, which
// needs the [lang] root layout around it.
export default function CatchAllPage() {
  notFound();
}
