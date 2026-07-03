"use client";
import {Badge,Card} from "@/components/ui";

const events=[
["09:02","Valuation","Fair value recalculated","done"],
["09:03","Risk","HOA risk updated","done"],
["09:05","Forecast","Market trend improved","live"],
["09:06","Offer","Offer adjusted","pending"],
["09:07","Executive","Final recommendation","brain"],
];

const cls=(s:string)=>s==="done"?"bg-emerald-400":s==="live"?"bg-cyan-400 animate-pulse":s==="brain"?"bg-white":"bg-amber-300";

export default function ExecutiveTimeline(){
return(
<Card variant="premium" className="p-8 overflow-hidden">
<Badge variant="pro">Executive Timeline</Badge>
<h2 className="mt-4 text-4xl font-semibold text-white">Reasoning Timeline</h2>
<div className="mt-8 grid gap-4">
{events.map(([t,a,m,s],i)=>(
<div key={i} className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
<div className="w-16 text-white/40 text-sm">{t}</div>
<div className={`mt-1 h-3 w-3 rounded-full ${cls(s as string)}`}></div>
<div>
<p className="text-white font-semibold">{a}</p>
<p className="text-white/60 text-sm mt-1">{m}</p>
</div>
</div>
))}
</div>
</Card>);
}
