"use strict";(()=>{var e={};e.id=813,e.ids=[813],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6122:(e,t,s)=>{s.r(t),s.d(t,{originalPathname:()=>m,patchFetch:()=>_,requestAsyncStorage:()=>c,routeModule:()=>d,serverHooks:()=>l,staticGenerationAsyncStorage:()=>g});var r={};s.r(r),s.d(r,{GET:()=>p});var a=s(9303),o=s(8716),i=s(670),n=s(7070),u=s(7982);async function p(e){try{let{searchParams:t}=new URL(e.url),s=t.get("module_id"),r=t.get("session_id");if(!s||!r)return n.NextResponse.json({error:"缺少 module_id 或 session_id 参数"},{status:400});let{data:a,error:o}=await u.O.from("tag_votes").select(`
        subcategory_id,
        created_at,
        tag_subcategories (
          id,
          name,
          description,
          tag_categories (
            id,
            name
          )
        )
      `).eq("module_id",s).eq("session_id",r);if(o)return n.NextResponse.json({error:o.message},{status:500});if(!a||0===a.length)return n.NextResponse.json([]);let i=a.map(e=>({subcategory_id:e.subcategory_id,subcategory:e.tag_subcategories,created_at:e.created_at}));return n.NextResponse.json(i)}catch(e){return n.NextResponse.json({error:"Internal server error"},{status:500})}}let d=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/tags/votes/user/route",pathname:"/api/tags/votes/user",filename:"route",bundlePath:"app/api/tags/votes/user/route"},resolvedPagePath:"/home/runner/work/rw-webapp/rw-webapp/src/app/api/tags/votes/user/route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:c,staticGenerationAsyncStorage:g,serverHooks:l}=d,m="/api/tags/votes/user/route";function _(){return(0,i.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:g})}},7982:(e,t,s)=>{s.d(t,{O:()=>i});let r=require("@supabase/supabase-js"),a="https://eguhisfzeimoivfmikgb.supabase.co",o="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVndWhpc2Z6ZWltb2l2Zm1pa2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzOTMzNzEsImV4cCI6MjA3MDk2OTM3MX0.3E8MD1a8SebcCo2IDQmXd9BFv18zh1213eGfZ-3EcD0",i=(0,r.createClient)(a,o);(0,r.createClient)(a,process.env.SUPABASE_SERVICE_ROLE_KEY||o)}};var t=require("../../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[276,972],()=>s(6122));module.exports=r})();