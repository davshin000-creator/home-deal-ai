"use client";
import { useEffect, useState } from "react";

export default function ContentStudioPage(){
  const [items,setItems]=useState<any[]>([]); const [message,setMessage]=useState("");
  useEffect(()=>{loadContent();},[]);
  async function loadContent(){const r=await fetch("/api/growth/content",{cache:"no-store"});const d=await r.json();if(!r.ok)return setMessage(d.error||"Could not load content.");setItems(d.items||[]);}
  async function markPublished(id:string){const r=await fetch("/api/growth/content",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,status:"published"})});const d=await r.json();if(!r.ok)return setMessage(d.error||"Could not update content.");await loadContent();}
  return <main className="min-h-screen bg-[#050505] px-6 py-12 text-white"><section className="mx-auto max-w-7xl">
    <a href="/growth" className="text-sm font-semibold text-white/50 hover:text-white">??Growth Engine</a>
    <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-white/35">Content Studio</p>
    <h1 className="mt-4 text-6xl font-semibold tracking-[-0.07em]">Drafts, published posts, and growth assets.</h1>
    {message&&<div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-white/70">{message}</div>}
    <section className="mt-8 grid gap-4">{items.length===0&&<div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-white/55">No content saved yet.</div>}{items.map((item)=><div key={item.id} className="rounded-[34px] border border-white/10 bg-white/[0.06] p-6"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">{item.platform} · {item.status}</p><h2 className="mt-2 text-3xl font-semibold">{item.title}</h2><p className="mt-3 text-white/55">{item.hook}</p><p className="mt-4 text-sm text-white/45">{item.caption}</p>{item.status!=="published"&&<button onClick={()=>markPublished(item.id)} className="mt-5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">Mark Published</button>}</div>)}</section>
  </section></main>
}

