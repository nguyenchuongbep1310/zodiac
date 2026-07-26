import { TopNav } from "@/components/layout/TopNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 lg:px-6 xl:px-8 pb-16">
        {children}
      </main>
    </div>
  );
}
