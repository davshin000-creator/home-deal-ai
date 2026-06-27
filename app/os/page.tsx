import OSHeader from "@/components/os/OSHeader";
import OSSidebar from "@/components/os/OSSidebar";
import AISidebar from "@/components/os/AISidebar";
import PropertyHero from "@/components/os/PropertyHero";
import WorkspaceMain from "@/components/os/WorkspaceMain";
import ActivityFeed from "@/components/os/ActivityFeed";

export default function NestrovaOSPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-neutral-950">
      <OSHeader />
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_360px]">
        <OSSidebar />
        <section className="min-w-0 p-4 md:p-6">
          <div className="grid gap-6">
            <PropertyHero />
            <WorkspaceMain />
            <ActivityFeed />
          </div>
        </section>
        <AISidebar />
      </div>
    </main>
  );
}
