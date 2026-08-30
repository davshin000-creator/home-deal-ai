import type { ReactNode } from "react";
import NestrovaHeader from "@/components/shell/NestrovaHeader";
import NestrovaSidebar from "@/components/shell/NestrovaSidebar";
import ProductNavigation from "@/components/shell/ProductNavigation";

type NestrovaAppShellProps = {
  children: ReactNode;
  userName?: string | null;
  title?: string;
  subtitle?: string;
};

export default function NestrovaAppShell({
  children,
  userName,
  title,
  subtitle,
}: NestrovaAppShellProps) {
  return (
    <div className="min-h-screen bg-[#08080b] text-white">
      <div className="flex min-h-screen">
        <NestrovaSidebar />

        <div className="min-w-0 flex-1">
          <NestrovaHeader
            userName={userName}
            title={title}
            subtitle={subtitle}
          />

          <ProductNavigation />

          <main className="relative min-h-[calc(100vh-78px)] overflow-hidden">
            <div className="pointer-events-none absolute left-[10%] top-[-180px] h-[420px] w-[420px] rounded-full bg-violet-500/[0.08] blur-[120px]" />

            <div className="pointer-events-none absolute right-[-120px] top-[20%] h-[360px] w-[360px] rounded-full bg-cyan-400/[0.05] blur-[120px]" />

            <div className="relative">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}