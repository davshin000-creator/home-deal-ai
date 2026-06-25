import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
const url=process.env.NEXT_PUBLIC_SUPABASE_URL||process.env.SUPABASE_URL;
const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
export async function GET(){
 if(!url||!key) return NextResponse.json({error:"Missing Supabase vars"},{status:500});
 const s=createClient(url,key);
 async function c(t:string){const {count}=await s.from(t).select("*",{count:"exact",head:true});return count||0;}
 return NextResponse.json({
 users:await c("user_profiles"),
 waitlist:await c("waitlist"),
 feedback:await c("beta_feedback"),
 reports:await c("ai_reports"),
 coachPlans:await c("coach_plans"),
 weeklyReports:await c("weekly_portfolio_reports"),
 watchlist:await c("watchlist_items")
 });
}
