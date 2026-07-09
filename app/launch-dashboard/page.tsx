"use client";
import { useEffect, useState } from "react";

export default function LaunchDashboardPage() {
  const [funnel,setFunnel]=useState<any[]>([]);
  const [sources,setSources]=useState<any[]>([]);
  const [message,setMessage]=useState("");
  useEffect(()=>{load();},[]);
  async function load(){
    const f=await fetch("/api/growth/funnel",{cache:"no-store"});
    const s=await fetch("/api/growth/referral",{cache:"no-store"});
    const fd=await f.json(); const sd=await s.json();
    if(!f.ok)setMessage(fd.error||"Could not load funnel.");
    if(!s.ok)setMessage(sd.error||"Could not load sources.");
    setFunnel(fd.funnel||[]); setSources(sd.top_sources||[]);
  }
  return <main className="min-h-screen bg-[#050505] px-6 py-12 text-white"><section className="mx-auto max-w-7xl">
    <a href="/dashboard" className="text-sm font-semibold text-white/50 hover:text-white">??Dashboard</a>
    <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-white/35">Launch Readiness</p>
    <h1 className="mt-4 text-6xl font-semibold tracking-[-0.07em]">Nestrova Growth Dashboard</h1>
    <p className="mt-5 max-w-3xl text-white/55">Track the funnel from landing page to checkout intent.</p>
    {message&&<div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-white/70">{message}</div>}
    <section className="mt-8 grid gap-4 md:grid-cols-3">{funnel.map((item)=><div key={item.event_name} className="rounded-[30px] border border-white/10 bg-white/[0.06] p-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">{item.event_name.replaceAll("_"," ")}</p><p className="mt-3 text-5xl font-semibold tracking-[-0.06em]">{item.count}</p><p className="mt-2 text-sm text-white/45">{item.conversion_from_landing}% from landing</p></div>)}</section>
    <section className="mt-8 rounded-[34px] border border-white/10 bg-white/[0.06] p-6"><h2 className="text-3xl font-semibold tracking-[-0.04em]">Top Acquisition Sources</h2><div className="mt-5 grid gap-3">{sources.length===0&&<p className="text-white/45">No acquisition events yet.</p>}{sources.map((item)=><div key={item.source} className="flex items-center justify-between rounded-2xl bg-black/25 p-4"><span>{item.source}</span><strong>{item.count}</strong></div>)}</div></section>
  </section></main>;
}

