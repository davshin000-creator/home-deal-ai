import OSHeader from "@/components/os/OSHeader";
import OSSidebar from "@/components/os/OSSidebar";
import AISidebar from "@/components/os/AISidebar";
import CommandCenter from "@/components/command/CommandCenter";
import RC45Workspace from "@/components/os/RC45Workspace";

export default function NestrovaOSPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-neutral-950">
      <CommandCenter />
      <OSHeader />

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_360px]">
        <OSSidebar />

        <section className="min-w-0 p-4 md:p-6">
          <RC45Workspace />
        </section>

        <AISidebar />
      </div>
    </main>
  );
}
