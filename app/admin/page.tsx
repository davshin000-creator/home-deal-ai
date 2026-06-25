export default function AdminDashboard(){
return (
<main className="min-h-screen p-8 bg-gray-50">
<div className="max-w-6xl mx-auto">
<h1 className="text-5xl font-bold">Nestrova Admin Dashboard</h1>
<p className="mt-3 text-gray-600">Monitor growth, users, AI usage and beta activity.</p>
<div className="grid md:grid-cols-4 gap-4 mt-8">
{["Users","Waitlist","AI Reports","Coach Plans","Saved Deals","Feedback","Weekly Reports","Revenue"].map(x=>
<div key={x} className="rounded-2xl bg-white shadow p-6">
<p className="text-gray-500">{x}</p>
<p className="text-3xl font-bold">--</p>
</div>)}
</div>
</div>
</main>);
}
