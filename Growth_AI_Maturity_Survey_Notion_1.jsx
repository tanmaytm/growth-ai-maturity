import { useState, useRef, useEffect, useCallback } from "react";

const BLUE = "#1B2A4A";
const MID = "#2E5090";
const LIGHT = "#D5E8F0";
const ACCENT = "#E8F0FE";
const TEXT = "#333";
const STAGE_COLORS = ["#94A3B8","#60A5FA","#3B82F6","#2563EB","#1D4ED8"];
const STAGE_NAMES = ["AI Curious Growth","AI Assisted Growth","AI Powered Growth","AI Orchestrated Growth","Autonomous Growth"];

const categories = [
  {
    id: "techstack", title: "Growth Tech Stack & Tool Utilization", weight: 15, icon: "⚙️",
    questions: [
      { q: "How completely does your tech stack cover your growth function needs?", opts: ["CRM and email tool only; major capability gaps","CRM, marketing automation, and basic analytics (3–5 tools)","Full stack: CRM, CDP, analytics, enrichment, orchestration (6–10 tools)","Advanced stack with AI platforms, decision engines, vector DBs (10–15 tools)","AI-native stack with agents managing pipeline, targeting & optimization"] },
      { q: "What percentage of your CRM's available features does your team actively use?", opts: ["Less than 20% — basic contact storage only","20–40% — pipeline tracking, email templates, basic reports","40–60% — workflows, lead scoring, custom objects, dashboards","60–80% — API integrations, predictive scoring, AI copilot features","Over 80% — full platform leverage with autonomous orchestration"] },
      { q: "How integrated are the tools in your growth tech stack?", opts: ["Manual CSV exports; no live integrations","1–3 native integrations (e.g., CRM ↔ email tool)","4–8 integrations; CDP connected; bi-directional data sync","9–15 integrations; unified data layer; real-time event streaming","15+ integrations; fully orchestrated with AI routing data across tools"] },
    ]
  },
  {
    id: "processes", title: "Processes & Workflow Maturity", weight: 15, icon: "🔄",
    questions: [
      { q: "How would you describe your lead management process?", opts: ["Manual lead capture; no defined routing or qualification criteria","Basic MQL/SQL definitions; manual routing with simple rules","Automated lead scoring & routing with lifecycle stage management","Predictive lead prioritization; dynamic routing based on buying signals","AI autonomously qualifies, routes & nurtures leads end-to-end"] },
      { q: "How many structured experiments does your team run per month?", opts: ["0–1 tests/month; ad hoc testing with no framework","2–5 tests/month; basic A/B testing on emails or landing pages","6–15 tests/month; structured testing across channels with learnings","16–30 tests/month; multivariate testing with statistical rigor","30+ tests/month; AI-designed experiments running autonomously"] },
      { q: "How well are your marketing and sales processes integrated?", opts: ["Marketing & sales operate in silos; no shared processes","Shared definitions (MQL/SQL); occasional alignment meetings","Integrated handoff processes; shared dashboards & SLAs","Unified RevOps process layer; continuous feedback loops","Fully autonomous cross-functional orchestration driven by AI"] },
    ]
  },
  {
    id: "data", title: "Customer & Revenue Data", weight: 15, icon: "📊",
    questions: [
      { q: "How unified is your customer data across marketing, sales, and product?", opts: ["Siloed in 5+ disconnected tools; no single customer view","Partial consolidation; CRM as primary source with manual syncs","CDP or warehouse established; unified customer profiles emerging","Real-time unified data layer across marketing, sales & product","Fully connected growth intelligence platform with predictive models"] },
      { q: "What is the approximate quality level of your customer data?", opts: ["Over 30% duplicate/stale records; no data hygiene practices","15–30% issues; basic deduplication; periodic manual cleanup","5–15% issues; automated enrichment & validation rules in place","Less than 5% issues; real-time monitoring & auto-correction","Less than 1%; AI-driven stewardship maintaining gold-standard data"] },
      { q: "How granular is your revenue data and attribution?", opts: ["Only top-line revenue; no attribution to channels or campaigns","Basic funnel metrics with last-touch attribution","Multi-touch attribution; pipeline velocity; cohort analysis","Predictive revenue modeling; incrementality testing; LTV by segment","Real-time revenue intelligence with AI-driven forecasting"] },
    ]
  },
  {
    id: "ai", title: "AI Capabilities", weight: 15, icon: "🤖",
    questions: [
      { q: "How many distinct AI use cases are deployed across your growth functions?", opts: ["1–2 use cases; mainly content drafting or chatbots","3–5; lead scoring, targeting, chatbot, content assistance","6–10; predictive analytics, churn prediction, next-best-action","11–20; decision engines, dynamic pricing, cross-channel optimization","20+; AI embedded across every growth function autonomously"] },
      { q: "What level of autonomy do AI systems have in growth decisions?", opts: ["AI provides suggestions; all decisions made by humans","AI recommends; humans approve before execution","AI executes routine decisions; humans review exceptions","AI makes most decisions; humans set guardrails & strategy","AI autonomously optimizes with human strategic oversight only"] },
      { q: "How personalized are your customer interactions powered by AI?", opts: ["No personalization; same message for all prospects","Segment-based (industry, company size, role)","Behavioral (actions, engagement, intent signals)","1:1 at account level; dynamic content & offers","Hyper-personalized in real-time per individual across all touchpoints"] },
    ]
  },
  {
    id: "pipeline", title: "Pipeline & Campaign Intelligence", weight: 15, icon: "🎯",
    questions: [
      { q: "How accurate is your pipeline forecasting?", opts: ["No forecasting; relies on gut-feel estimates","Basic weighted pipeline; static win-rate assumptions","ML-based deal scoring; 60–70% accuracy","Multi-signal predictive models; 70–85% accuracy","AI-driven with 85%+ accuracy; real-time adjustments"] },
      { q: "How sophisticated is your campaign targeting approach?", opts: ["Batch-and-blast to static lists; no segmentation","Basic firmographic & demographic filters","Behavioral & intent-based targeting; lookalike audiences","Predictive targeting; AI-selected audiences; propensity scoring","Autonomous audience discovery; AI identifies untapped segments"] },
      { q: "How does your team optimize campaigns mid-flight?", opts: ["No mid-campaign adjustments; post-mortem only","Manual tweaks based on weekly performance reports","Automated A/B testing with statistical significance thresholds","Real-time optimization; dynamic budget & audience shifting","AI autonomously optimizes all parameters continuously"] },
    ]
  },
  {
    id: "content", title: "Content & Outreach Production", weight: 15, icon: "✍️",
    questions: [
      { q: "How many content assets does your team produce per month?", opts: ["Fewer than 10; fully manual creation","10–30; templates & AI-assisted first drafts","30–75; AI generates variants, humans edit & QA","75–200; AI produces near-final content at scale","200+; AI autonomously creates, tests & optimizes"] },
      { q: "How personalized is your outreach at scale?", opts: ["Generic one-size-fits-all messaging","Segment-level (industry, persona templates)","Account-level using enrichment & intent data","1:1 dynamic content per prospect; AI-tailored at scale","Real-time hyper-personalized for every interaction automatically"] },
      { q: "How coordinated is your outreach across channels?", opts: ["Single channel (email only or calls only)","2–3 channels used independently; no coordination","Coordinated sequences across email, social, ads, calls","AI-orchestrated multi-channel with dynamic channel selection","Autonomous omni-channel; AI selects optimal channel per prospect"] },
    ]
  },
  {
    id: "measurement", title: "Measurement & Revenue Attribution", weight: 10, icon: "📈",
    questions: [
      { q: "What attribution model does your organization use?", opts: ["No attribution; only last-touch or first-touch manually","Single-touch attribution in an analytics tool","Multi-touch (linear, time-decay, or position-based)","Data-driven with custom models & incrementality testing","AI-driven dynamic attribution; real-time credit allocation"] },
      { q: "How would you describe your reporting capabilities?", opts: ["Manual spreadsheet reports; lagging indicators only","Dashboard-based; funnel metrics & campaign performance","Automated insights; anomaly detection; drill-down analytics","Predictive insights; AI-surfaced opportunities & risk alerts","Autonomous insight generation; AI prescribes actions from data"] },
      { q: "How accurate is your revenue forecasting?", opts: ["No formal forecast; pipeline weighted average only","Quarterly with ~30% variance; manual adjustments","Monthly rolling; 15–20% variance; ML-assisted","Weekly; ~10% variance; multi-signal predictive models","Real-time; ~5% variance; AI auto-adjusts with market signals"] },
    ]
  },
];

const stageRanges = [{min:1,max:1.8,stage:0},{min:1.81,max:2.6,stage:1},{min:2.61,max:3.4,stage:2},{min:3.41,max:4.2,stage:3},{min:4.21,max:5,stage:4}];
function getStage(s){for(const r of stageRanges)if(s>=r.min&&s<=r.max)return r.stage;return 0;}

function RadarChart({catScores,size=300}){
  const cx=size/2,cy=size/2,r=size*.38,n=catScores.length,step=(2*Math.PI)/n;
  const pt=(i,v)=>{const a=step*i-Math.PI/2,d=(v/5)*r;return[cx+d*Math.cos(a),cy+d*Math.sin(a)];};
  const poly=catScores.map((s,i)=>pt(i,s.score).join(",")).join(" ");
  return(
    <svg viewBox={`0 0 ${size} ${size}`} style={{width:"100%",maxWidth:size}}>
      {[1,2,3,4,5].map(l=>{const pts=Array.from({length:n},(_,i)=>pt(i,l).join(",")).join(" ");return<polygon key={l} points={pts} fill="none" stroke="#ddd" strokeWidth={.5}/>;})}
      {Array.from({length:n},(_,i)=>{const[x,y]=pt(i,5);return<line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#eee" strokeWidth={.5}/>;})}<polygon points={poly} fill="rgba(46,80,144,0.2)" stroke={MID} strokeWidth={2}/>
      {catScores.map((s,i)=>{const[x,y]=pt(i,s.score);return<circle key={i} cx={x} cy={y} r={4} fill={MID}/>;})}{catScores.map((s,i)=>{const[x,y]=pt(i,5.6);const a=x<cx-10?"end":x>cx+10?"start":"middle";return<text key={i} x={x} y={y} textAnchor={a} fontSize={9} fill={TEXT} fontFamily="'DM Sans',sans-serif">{s.icon} {s.shortTitle}</text>;})}
    </svg>);
}

function ProgressBar({value,max=5}){const pct=(value/max)*100;return(<div style={{background:"#e5e7eb",borderRadius:6,height:10,width:"100%",overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${STAGE_COLORS[0]},${STAGE_COLORS[getStage(value)]})`,borderRadius:6,transition:"width 0.5s ease"}}/></div>);}

export default function App(){
  const[screen,setScreen]=useState("welcome");
  const[info,setInfo]=useState({name:"",title:"",org:"",industry:"",size:"",email:""});
  const[answers,setAnswers]=useState({});
  const[currentCat,setCurrentCat]=useState(0);
  const[notionStatus,setNotionStatus]=useState("idle"); // idle|saving|success|error
  const[notionMsg,setNotionMsg]=useState("");
  const[allResponses,setAllResponses]=useState([]);
  const topRef=useRef(null);

  useEffect(()=>{topRef.current?.scrollIntoView({behavior:"smooth"});},[screen,currentCat]);
  useEffect(()=>{
    const load=async()=>{try{const r=await window.storage.get("all_responses");if(r)setAllResponses(JSON.parse(r.value));}catch(e){}};
    load();
  },[]);

  const totalQ=categories.reduce((a,c)=>a+c.questions.length,0);
  const answeredQ=Object.keys(answers).length;
  const allAnswered=answeredQ===totalQ;

  const handleAnswer=(ci,qi,v)=>setAnswers(p=>({...p,[`${ci}-${qi}`]:v+1}));
  const getCatScore=(ci)=>{const cat=categories[ci];const sc=cat.questions.map((_,qi)=>answers[`${ci}-${qi}`]||0).filter(s=>s>0);return sc.length?sc.reduce((a,b)=>a+b,0)/sc.length:0;};
  const getOverallScore=()=>{let tw=0,ws=0;categories.forEach((c,i)=>{const s=getCatScore(i);if(s>0){ws+=s*c.weight;tw+=c.weight;}});return tw>0?ws/tw:0;};

  const saveToNotion=useCallback(async()=>{
    setNotionStatus("saving");setNotionMsg("Sending to Notion...");
    const overall=getOverallScore();const stage=getStage(overall);
    const catScoresObj={};categories.forEach((c,i)=>{catScoresObj[c.title]=getCatScore(i).toFixed(2);});
    const prompt=`Create a new page in a Notion database. First search for a database called "AI Maturity Responses". If it doesn't exist, create a new database page with that title.

The page should have these properties:
- Name (title): "${info.name}"
- Organization: "${info.org}"
- Title/Role: "${info.title}"
- Industry: "${info.industry}"
- Company Size: "${info.size}"
- Email: "${info.email}"
- Overall Score: ${overall.toFixed(2)}
- Maturity Stage: "Stage ${stage+1}: ${STAGE_NAMES[stage]}"
- Assessment Date: "${new Date().toISOString().slice(0,10)}"
${categories.map((c,i)=>`- ${c.title} Score: ${getCatScore(i).toFixed(2)}`).join("\n")}

The body of the page should contain:
# AI Maturity Assessment Results
## Overall Score: ${overall.toFixed(2)} / 5.00 — Stage ${stage+1}: ${STAGE_NAMES[stage]}

## Category Breakdown
${categories.map((c,i)=>`- ${c.icon} ${c.title}: ${getCatScore(i).toFixed(2)} (Stage ${getStage(getCatScore(i))+1})`).join("\n")}

## Detailed Responses
${categories.map((c,ci)=>`### ${c.icon} ${c.title}\n${c.questions.map((q,qi)=>`- **Q: ${q.q}**\n  Answer: ${answers[`${ci}-${qi}`]||"N/A"} — ${q.opts[(answers[`${ci}-${qi}`]||1)-1]}`).join("\n")}`).join("\n\n")}`;

    try{
      const resp=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          messages:[{role:"user",content:prompt}],
          mcp_servers:[{type:"url",url:"https://mcp.notion.com/mcp",name:"notion-mcp"}],
        }),
      });
      const data=await resp.json();
      const textBlocks=data.content?.filter(b=>b.type==="text").map(b=>b.text).join(" ")||"";
      const toolResults=data.content?.filter(b=>b.type==="mcp_tool_result")||[];

      if(toolResults.length>0||textBlocks.toLowerCase().includes("created")||textBlocks.toLowerCase().includes("success")){
        setNotionStatus("success");setNotionMsg("Saved to Notion successfully!");

        const newResponse={...info,overallScore:overall.toFixed(2),stage:`Stage ${stage+1}`,date:new Date().toISOString().slice(0,10),catScores:catScoresObj};
        const updated=[...allResponses,newResponse];
        setAllResponses(updated);
        try{await window.storage.set("all_responses",JSON.stringify(updated));}catch(e){}
      } else {
        setNotionStatus("success");setNotionMsg("Request sent to Notion. Check your workspace for the new page.");
        const newResponse={...info,overallScore:overall.toFixed(2),stage:`Stage ${stage+1}`,date:new Date().toISOString().slice(0,10),catScores:catScoresObj};
        const updated=[...allResponses,newResponse];setAllResponses(updated);
        try{await window.storage.set("all_responses",JSON.stringify(updated));}catch(e){}
      }
    }catch(e){
      setNotionStatus("error");setNotionMsg("Could not connect to Notion. Try CSV export instead.");
    }
  },[info,answers,allResponses]);

  const exportCSV=()=>{
    let csv="Respondent Name,Title,Organization,Industry,Company Size,Email,Overall Score,Maturity Stage";
    categories.forEach(c=>{csv+=`,${c.title} Score`;});
    categories.forEach((c,ci)=>{c.questions.forEach((q,qi)=>{csv+=`,"${q.q.replace(/"/g,'""')}"`;});});
    csv+="\n";
    const overall=getOverallScore();const stage=STAGE_NAMES[getStage(overall)];
    csv+=`"${info.name}","${info.title}","${info.org}","${info.industry}","${info.size}","${info.email}",${overall.toFixed(2)},"Stage ${getStage(overall)+1}: ${stage}"`;
    categories.forEach((_,ci)=>{csv+=`,${getCatScore(ci).toFixed(2)}`;});
    categories.forEach((c,ci)=>{c.questions.forEach((_,qi)=>{csv+=`,${answers[`${ci}-${qi}`]||""}`;});});
    csv+="\n";
    const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`AI_Maturity_${info.org||"Assessment"}_${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url);
  };

  const exportNotionCSV=()=>{
    let csv="Name,Organization,Title,Industry,Company Size,Email,Overall Score,Maturity Stage,Assessment Date";
    categories.forEach(c=>{csv+=`,${c.title}`;});
    csv+="\n";
    const all=[...allResponses];
    const overall=getOverallScore();
    if(overall>0){
      const current={name:info.name,org:info.org,title:info.title,industry:info.industry,size:info.size,email:info.email,overallScore:overall.toFixed(2),stage:`Stage ${getStage(overall)+1}`,date:new Date().toISOString().slice(0,10),catScores:{}};
      categories.forEach((c,i)=>{current.catScores[c.title]=getCatScore(i).toFixed(2);});
      if(!all.find(r=>r.email===info.email&&r.date===current.date))all.push(current);
    }
    all.forEach(r=>{
      csv+=`"${r.name||""}","${r.org||""}","${r.title||""}","${r.industry||""}","${r.size||""}","${r.email||""}",${r.overallScore},"${r.stage}","${r.date}"`;
      categories.forEach(c=>{csv+=`,${r.catScores?.[c.title]||""}`;});
      csv+="\n";
    });
    const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`AI_Maturity_All_Responses_${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url);
  };

  const copyResults=()=>{
    const overall=getOverallScore();const stage=getStage(overall);
    let t=`AI Maturity Assessment Results\n${"=".repeat(40)}\nRespondent: ${info.name} | ${info.title} | ${info.org}\nOverall Score: ${overall.toFixed(2)} / 5.00\nMaturity Stage: Stage ${stage+1} — ${STAGE_NAMES[stage]}\n\nCategory Breakdown:\n${"-".repeat(40)}\n`;
    categories.forEach((c,i)=>{const s=getCatScore(i);t+=`${c.icon} ${c.title}: ${s.toFixed(2)} (Stage ${getStage(s)+1})\n`;});
    navigator.clipboard.writeText(t);
  };

  const font="'DM Sans',sans-serif";

  // ── Welcome ──
  if(screen==="welcome")return(
    <div ref={topRef} style={{fontFamily:font,minHeight:"100vh",background:`linear-gradient(135deg,${BLUE} 0%,${MID} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet"/>
      <div style={{maxWidth:560,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:8}}>🚀</div>
        <h1 style={{fontFamily:"'Space Grotesk',sans-serif",color:"#fff",fontSize:32,margin:"0 0 8px",letterSpacing:-1}}>Growth AI-Maturity</h1>
        <h2 style={{color:LIGHT,fontSize:18,fontWeight:400,margin:"0 0 32px"}}>Self-Assessment for CMOs & Growth Leaders</h2>
        <div style={{background:"rgba(255,255,255,0.1)",backdropFilter:"blur(10px)",borderRadius:16,padding:32,textAlign:"left"}}>
          <p style={{color:"#ccc",fontSize:14,lineHeight:1.6,margin:"0 0 16px"}}>This assessment maps your organization across <strong style={{color:"#fff"}}>7 growth dimensions</strong> to identify your AI maturity stage — from AI Curious to Autonomous Growth.</p>
          <p style={{color:"#ccc",fontSize:14,lineHeight:1.6,margin:"0 0 8px"}}><strong style={{color:"#fff"}}>21 questions</strong> · ~15 minutes · Instant results</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",margin:"12px 0 24px"}}>
            {["📊 Radar Analysis","📥 CSV Export","📓 Notion Sync","📋 Copy Results"].map(f=>(
              <span key={f} style={{fontSize:11,background:"rgba(255,255,255,0.15)",borderRadius:6,padding:"4px 10px",color:"#ddd"}}>{f}</span>
            ))}
          </div>
          <button onClick={()=>setScreen("info")} style={{width:"100%",padding:"14px 0",background:"#fff",color:BLUE,border:"none",borderRadius:10,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:font}}>Start Assessment →</button>
        </div>
        {allResponses.length>0&&(
          <button onClick={()=>setScreen("dashboard")} style={{marginTop:16,padding:"10px 24px",background:"transparent",color:"#fff",border:"1.5px solid rgba(255,255,255,0.3)",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:font}}>
            📊 View Dashboard ({allResponses.length} response{allResponses.length!==1?"s":""})
          </button>
        )}
      </div>
    </div>
  );

  // ── Info ──
  if(screen==="info")return(
    <div ref={topRef} style={{fontFamily:font,minHeight:"100vh",background:"#f8fafc",padding:"40px 20px"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet"/>
      <div style={{maxWidth:520,margin:"0 auto"}}>
        <h2 style={{fontFamily:"'Space Grotesk',sans-serif",color:BLUE,fontSize:24,margin:"0 0 4px"}}>Respondent Information</h2>
        <p style={{color:"#94a3b8",fontSize:14,margin:"0 0 24px"}}>Help us personalize your maturity report</p>
        {[{key:"name",label:"Full Name",ph:"e.g., Priya Sharma"},{key:"title",label:"Title / Designation",ph:"e.g., CMO, VP Growth"},{key:"org",label:"Organization",ph:"e.g., Acme Corp"},{key:"industry",label:"Industry",ph:"e.g., B2B SaaS, FinTech"},{key:"size",label:"Company Size",ph:"e.g., 200-500 employees"},{key:"email",label:"Email",ph:"e.g., priya@acme.com"}].map(f=>(
          <div key={f.key} style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:BLUE,marginBottom:4}}>{f.label}</label>
            <input value={info[f.key]} onChange={e=>setInfo(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} style={{width:"100%",padding:"10px 14px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:15,fontFamily:font,outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=MID} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
          </div>
        ))}
        <div style={{display:"flex",gap:12,marginTop:24}}>
          <button onClick={()=>setScreen("welcome")} style={{flex:1,padding:"12px",background:"#fff",color:TEXT,border:"1.5px solid #e2e8f0",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:font}}>← Back</button>
          <button onClick={()=>{setCurrentCat(0);setScreen("survey");}} disabled={!info.name||!info.org} style={{flex:2,padding:"12px",background:(!info.name||!info.org)?"#94a3b8":MID,color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:(!info.name||!info.org)?"default":"pointer",fontFamily:font,opacity:(!info.name||!info.org)?.6:1}}>Begin Survey →</button>
        </div>
      </div>
    </div>
  );

  // ── Dashboard ──
  if(screen==="dashboard")return(
    <div ref={topRef} style={{fontFamily:font,minHeight:"100vh",background:"#f8fafc",padding:"40px 20px"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet"/>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div>
            <h1 style={{fontFamily:"'Space Grotesk',sans-serif",color:BLUE,fontSize:24,margin:0}}>📊 Response Dashboard</h1>
            <p style={{color:"#94a3b8",fontSize:13,margin:"4px 0 0"}}>{allResponses.length} assessment{allResponses.length!==1?"s":""} collected</p>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={exportNotionCSV} style={{padding:"8px 16px",background:MID,color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font}}>📥 Export All CSV</button>
            <button onClick={()=>setScreen("welcome")} style={{padding:"8px 16px",background:"#fff",color:TEXT,border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font}}>← Back</button>
          </div>
        </div>

        {/* Summary cards */}
        {allResponses.length>0&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:24}}>
            {[
              {label:"Avg Score",value:(allResponses.reduce((a,r)=>a+parseFloat(r.overallScore),0)/allResponses.length).toFixed(2),color:MID},
              {label:"Stage 1-2",value:allResponses.filter(r=>parseFloat(r.overallScore)<=2.6).length,color:"#f59e0b"},
              {label:"Stage 3",value:allResponses.filter(r=>{const s=parseFloat(r.overallScore);return s>2.6&&s<=3.4;}).length,color:"#3b82f6"},
              {label:"Stage 4-5",value:allResponses.filter(r=>parseFloat(r.overallScore)>3.4).length,color:"#059669"},
            ].map(c=>(
              <div key={c.label} style={{background:"#fff",borderRadius:12,padding:16,textAlign:"center",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
                <div style={{fontSize:28,fontWeight:700,color:c.color,fontFamily:"'Space Grotesk',sans-serif"}}>{c.value}</div>
                <div style={{fontSize:12,color:"#94a3b8",fontWeight:600}}>{c.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr style={{background:BLUE}}>
                  {["Name","Org","Industry","Score","Stage","Date"].map(h=>(
                    <th key={h} style={{padding:"10px 14px",color:"#fff",fontWeight:600,textAlign:"left",whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allResponses.map((r,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"#fff":"#fafbfc"}}>
                    <td style={{padding:"10px 14px",fontWeight:600,color:BLUE}}>{r.name}</td>
                    <td style={{padding:"10px 14px"}}>{r.org}</td>
                    <td style={{padding:"10px 14px"}}>{r.industry}</td>
                    <td style={{padding:"10px 14px",fontWeight:700,color:STAGE_COLORS[getStage(parseFloat(r.overallScore))]}}>{r.overallScore}</td>
                    <td style={{padding:"10px 14px"}}><span style={{background:ACCENT,color:MID,padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:600}}>{r.stage}</span></td>
                    <td style={{padding:"10px 14px",color:"#94a3b8"}}>{r.date}</td>
                  </tr>
                ))}
                {allResponses.length===0&&(
                  <tr><td colSpan={6} style={{padding:40,textAlign:"center",color:"#94a3b8"}}>No responses yet. Complete an assessment to see data here.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Results ──
  if(screen==="results"){
    const overall=getOverallScore();const stage=getStage(overall);
    const catScores=categories.map((c,i)=>({score:getCatScore(i),title:c.title,icon:c.icon,shortTitle:c.title.replace("& ","").split(" ").slice(0,2).join(" ")}));
    const strongest=[...catScores].sort((a,b)=>b.score-a.score)[0];
    const weakest=[...catScores].sort((a,b)=>a.score-b.score)[0];

    return(
      <div ref={topRef} style={{fontFamily:font,minHeight:"100vh",background:"#f8fafc",padding:"40px 20px"}}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet"/>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{fontSize:48,marginBottom:8}}>📋</div>
            <h1 style={{fontFamily:"'Space Grotesk',sans-serif",color:BLUE,fontSize:28,margin:"0 0 4px"}}>Your AI Maturity Report</h1>
            <p style={{color:"#94a3b8",fontSize:14,margin:0}}>{info.name} · {info.org}</p>
          </div>

          <div style={{background:`linear-gradient(135deg,${BLUE},${MID})`,borderRadius:16,padding:32,textAlign:"center",marginBottom:24,color:"#fff"}}>
            <div style={{fontSize:56,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>{overall.toFixed(2)}</div>
            <div style={{fontSize:14,opacity:.7,marginBottom:12}}>out of 5.00</div>
            <div style={{display:"inline-block",background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"6px 20px",fontSize:16,fontWeight:600}}>Stage {stage+1}: {STAGE_NAMES[stage]}</div>
          </div>

          <div style={{background:"#fff",borderRadius:16,padding:24,marginBottom:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
            <h3 style={{color:BLUE,fontSize:16,margin:"0 0 16px",fontWeight:700}}>Capability Radar</h3>
            <div style={{display:"flex",justifyContent:"center"}}><RadarChart catScores={catScores} size={320}/></div>
          </div>

          <div style={{background:"#fff",borderRadius:16,padding:24,marginBottom:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
            <h3 style={{color:BLUE,fontSize:16,margin:"0 0 16px",fontWeight:700}}>Category Breakdown</h3>
            {catScores.map((s,i)=>(<div key={i} style={{marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:13,fontWeight:600,color:TEXT}}>{s.icon} {s.title}</span><span style={{fontSize:13,fontWeight:700,color:STAGE_COLORS[getStage(s.score)]}}>{s.score.toFixed(2)} · Stage {getStage(s.score)+1}</span></div><ProgressBar value={s.score}/></div>))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
            <div style={{background:"#f0fdf4",borderRadius:12,padding:16,border:"1px solid #bbf7d0"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#166534",textTransform:"uppercase",marginBottom:4}}>💪 Strongest</div>
              <div style={{fontSize:14,fontWeight:600,color:"#15803d"}}>{strongest.icon} {strongest.title}</div>
              <div style={{fontSize:13,color:"#166534"}}>Score: {strongest.score.toFixed(2)}</div>
            </div>
            <div style={{background:"#fef2f2",borderRadius:12,padding:16,border:"1px solid #fecaca"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#991b1b",textTransform:"uppercase",marginBottom:4}}>🔧 Focus Area</div>
              <div style={{fontSize:14,fontWeight:600,color:"#dc2626"}}>{weakest.icon} {weakest.title}</div>
              <div style={{fontSize:13,color:"#991b1b"}}>Score: {weakest.score.toFixed(2)}</div>
            </div>
          </div>

          {/* Notion Save */}
          <div style={{background:"#fff",borderRadius:12,padding:20,marginBottom:16,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1.5px solid #e2e8f0"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <span style={{fontSize:20}}>📓</span>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:BLUE}}>Save to Notion</div>
                <div style={{fontSize:12,color:"#94a3b8"}}>Create a page in your Notion workspace with full results</div>
              </div>
            </div>
            <button onClick={saveToNotion} disabled={notionStatus==="saving"}
              style={{width:"100%",padding:"12px",background:notionStatus==="success"?"#059669":notionStatus==="error"?"#dc2626":BLUE,color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:notionStatus==="saving"?"default":"pointer",fontFamily:font,opacity:notionStatus==="saving"?.7:1}}>
              {notionStatus==="idle"?"Save to Notion →":notionStatus==="saving"?"⏳ Saving...":notionStatus==="success"?"✓ Saved!":"⚠ Try Again"}
            </button>
            {notionMsg&&<p style={{fontSize:12,color:notionStatus==="error"?"#dc2626":"#059669",margin:"8px 0 0",textAlign:"center"}}>{notionMsg}</p>}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <button onClick={exportCSV} style={{padding:"14px",background:MID,color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:font}}>📥 Export CSV</button>
            <button onClick={copyResults} style={{padding:"14px",background:"#fff",color:MID,border:`2px solid ${MID}`,borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:font}}>📋 Copy Results</button>
          </div>
          <div style={{display:"flex",gap:12}}>
            <button onClick={()=>{setScreen("survey");setCurrentCat(0);}} style={{flex:1,padding:"12px",background:"transparent",color:"#94a3b8",border:"1.5px solid #e2e8f0",borderRadius:10,fontSize:13,cursor:"pointer",fontFamily:font}}>← Review Answers</button>
            <button onClick={()=>setScreen("dashboard")} style={{flex:1,padding:"12px",background:"transparent",color:MID,border:`1.5px solid ${MID}`,borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:font}}>📊 Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Survey ──
  const cat=categories[currentCat];
  const catAnswered=cat.questions.filter((_,qi)=>answers[`${currentCat}-${qi}`]).length;

  return(
    <div ref={topRef} style={{fontFamily:font,minHeight:"100vh",background:"#f8fafc",padding:"24px 16px 100px"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet"/>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:24}}>
          <span style={{fontSize:12,fontWeight:600,color:"#94a3b8",whiteSpace:"nowrap"}}>{answeredQ}/{totalQ}</span>
          <div style={{flex:1,background:"#e5e7eb",borderRadius:6,height:6,overflow:"hidden"}}><div style={{width:`${(answeredQ/totalQ)*100}%`,height:"100%",background:`linear-gradient(90deg,${MID},#3B82F6)`,borderRadius:6,transition:"width 0.3s"}}/></div>
        </div>

        <div style={{display:"flex",gap:6,marginBottom:24,overflowX:"auto",paddingBottom:4}}>
          {categories.map((c,i)=>{const done=c.questions.every((_,qi)=>answers[`${i}-${qi}`]);const active=i===currentCat;return(
            <button key={i} onClick={()=>setCurrentCat(i)} style={{flexShrink:0,padding:"8px 14px",borderRadius:8,border:active?`2px solid ${MID}`:"1.5px solid #e2e8f0",background:active?ACCENT:"#fff",color:active?MID:TEXT,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font}}>{c.icon} {done&&"✓"}</button>
          );})}
        </div>

        <div style={{marginBottom:24}}>
          <div style={{fontSize:12,fontWeight:600,color:MID,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Section {currentCat+1} of {categories.length}</div>
          <h2 style={{fontFamily:"'Space Grotesk',sans-serif",color:BLUE,fontSize:22,margin:"0 0 4px"}}>{cat.icon} {cat.title}</h2>
          <p style={{color:"#94a3b8",fontSize:13,margin:0}}>{catAnswered}/{cat.questions.length} answered · Weight: {cat.weight}%</p>
        </div>

        {cat.questions.map((q,qi)=>{const sel=answers[`${currentCat}-${qi}`];return(
          <div key={qi} style={{background:"#fff",borderRadius:14,padding:20,marginBottom:16,boxShadow:"0 1px 3px rgba(0,0,0,0.05)",border:sel?`1.5px solid ${LIGHT}`:"1.5px solid #f1f5f9"}}>
            <div style={{fontSize:14,fontWeight:600,color:BLUE,marginBottom:14,lineHeight:1.5}}>
              <span style={{color:MID,marginRight:6}}>Q{categories.slice(0,currentCat).reduce((a,c)=>a+c.questions.length,0)+qi+1}.</span>{q.q}
            </div>
            {q.opts.map((opt,oi)=>{const isSel=sel===oi+1;return(
              <button key={oi} onClick={()=>handleAnswer(currentCat,qi,oi)} style={{display:"flex",alignItems:"flex-start",gap:10,width:"100%",padding:"10px 12px",marginBottom:6,background:isSel?ACCENT:"#fafbfc",border:isSel?`1.5px solid ${MID}`:"1.5px solid #f1f5f9",borderRadius:10,cursor:"pointer",textAlign:"left",fontFamily:font,transition:"all 0.15s"}}>
                <span style={{flexShrink:0,width:22,height:22,borderRadius:"50%",border:isSel?`2px solid ${MID}`:"2px solid #cbd5e1",display:"flex",alignItems:"center",justifyContent:"center",marginTop:1,background:isSel?MID:"transparent",color:"#fff",fontSize:12,fontWeight:700}}>{isSel?"✓":oi+1}</span>
                <span style={{fontSize:13,color:isSel?BLUE:TEXT,fontWeight:isSel?600:400,lineHeight:1.5}}>{opt}</span>
              </button>
            );})}
          </div>
        );})}

        <div style={{display:"flex",gap:12,marginTop:24}}>
          {currentCat>0&&<button onClick={()=>setCurrentCat(currentCat-1)} style={{flex:1,padding:"14px",background:"#fff",color:TEXT,border:"1.5px solid #e2e8f0",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:font}}>← Previous</button>}
          {currentCat<categories.length-1?
            <button onClick={()=>setCurrentCat(currentCat+1)} style={{flex:2,padding:"14px",background:MID,color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:font}}>Next Section →</button>:
            <button onClick={()=>setScreen("results")} disabled={!allAnswered} style={{flex:2,padding:"14px",background:allAnswered?"#059669":"#94a3b8",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:allAnswered?"pointer":"default",fontFamily:font,opacity:allAnswered?1:.6}}>{allAnswered?"View Results →":`${totalQ-answeredQ} questions remaining`}</button>
          }
        </div>
      </div>
    </div>
  );
}
