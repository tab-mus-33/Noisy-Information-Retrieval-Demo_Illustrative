import React, { useState, useEffect } from "react";

const C = {
  bg:"#07080c",s1:"#0f1119",s2:"#161924",s3:"#1d2133",
  brd:"#252a3d",ink:"#eae6dd",soft:"#a49b8d",dim:"#605848",
  acc:"#3b82f6",accBg:"rgba(59,130,246,.08)",accGlow:"rgba(59,130,246,.2)",accB:"#93bbfc",
  grn:"#22c55e",grnBg:"rgba(34,197,94,.08)",
  red:"#ef4444",redBg:"rgba(239,68,68,.06)",
  amb:"#f59e0b",ambBg:"rgba(245,158,11,.08)",
  vio:"#a78bfa",vioBg:"rgba(167,139,250,.08)",
};
const mono="'JetBrains Mono',Menlo,monospace";
const body="'Outfit',system-ui,sans-serif";
const disp="'Syne',system-ui,sans-serif";

const QUERIES = [
  {
    id:1, original:"coronavirus spread", type:"topical",
    desc:"What were people saying about the spread of the novel coronavirus NCOV-19 in Wuhan at the end of 2019?",
    dcu_query:"2019 coronavirus spread wuhan",
    wiki_query:"2019 coronavirus spread wuhan wiki_covid19_pandemic_in_the_united_states wiki_coronavirus wiki_severe_acute_respiratory_syndrome_coronavirus_2 wiki_covid19 wiki_transmission_medicine wiki_novel_coronavirus wiki_wuhan",
    wikiQOnly:"Coronavirus",
    wikiQContext:"Novel coronavirus",
    wikiQContextFull:"2019-20 coronavirus pandemic",
    disambigWhy:"Generic virus family → the specific 2019 pandemic. Context adds geographic grounding (Wuhan) and transmission specifics.",
    nerTerms:["2019","wuhan"],
    keyWikiConcepts:["covid19 pandemic","coronavirus","SARS-CoV-2","covid19","transmission medicine","novel coronavirus","wuhan"],
  },
  {
    id:6, original:"michelle obama becoming", type:"topical",
    desc:"Former First Lady Michelle Obama\u2019s memoir Becoming was published in early 2019. What were people saying about it?",
    dcu_query:"obama michelle first lady becoming obama\u2019s early 2019",
    wiki_query:"obama michelle first lady becoming obama\u2019s early 2019 wiki_becoming_philosophy wiki_becoming_book wiki_first_lady_of_the_united_states wiki_michelle_obama wiki_barack_obama wiki_memoir",
    wikiQOnly:"Becoming (philosophy)",
    wikiQContext:"Becoming (book)",
    wikiQContextFull:"Michelle Obama's memoir",
    disambigWhy:"An abstract philosophical concept → a bestselling memoir. Without context, the search engine has no way to know which 'Becoming' you mean.",
    nerTerms:["obama","michelle","first","lady","2019"],
    keyWikiConcepts:["becoming (book)","first lady of the US","michelle obama","barack obama","memoir"],
  },
  {
    id:7, original:"anna delvey", type:"topical",
    desc:"Anna Sorokina posed as wealthy German heiress Anna Delvey. In 2019 she was convicted of grand larceny, theft, and fraud.",
    dcu_query:"sorokina 2013 york anna 2019 german city new delvey",
    wiki_query:"sorokina 2013 york anna 2019 german city new delvey wiki_anna_sorokin wiki_new_york_city wiki_fraud wiki_larceny wiki_socialite wiki_trial wiki_theft wiki_grand_jury",
    wikiQOnly:"Indian anna",
    wikiQContext:"Anna Sorokin",
    wikiQContextFull:"The convicted fraudster",
    disambigWhy:"A defunct Indian currency unit → the real person. Two-word queries are deeply ambiguous — the system literally cannot identify her without context.",
    nerTerms:["sorokina","2013","york","2019","german","city","new"],
    keyWikiConcepts:["anna sorokin","new york city","fraud","larceny","socialite","trial","theft"],
  },
  {
    id:2, original:"greta thunberg cross atlantic", type:"topical",
    desc:"What were people saying about Greta Thunberg\u2019s sailing trip across the Atlantic Ocean in the fall of 2019 and its relationship to global climate change?",
    dcu_query:"fall greta thunberg\u2019s atlantic thunberg cross ocean 2019",
    wiki_query:"fall greta thunberg\u2019s atlantic thunberg cross ocean 2019 wiki_atlantic_ocean wiki_climate_change wiki_sailing wiki_greta_thunberg",
    wikiQOnly:"\u2014 nothing detected",
    wikiQContext:"Greta Thunberg",
    wikiQContextFull:"+ Atlantic Ocean, Climate change",
    disambigWhy:"Zero concepts detected from the query alone. The name 'greta thunberg' is too rare for the search engine to resolve without supporting context.",
    nerTerms:["fall","greta","thunberg\u2019s","atlantic","thunberg","ocean","2019"],
    keyWikiConcepts:["greta thunberg","atlantic ocean","climate change","sailing"],
  },
];

const TABLE2 = [
  {m:"BM25",     t:"baseline",  P10:.31, desc:"Text matching only",          sees:["query words","segment words"],                            color:C.dim},
  {m:"DPH",      t:"baseline",  P10:.32, desc:"Better noise handling",       sees:["query words","segment words"],                            color:C.dim},
  {m:"DCU",      t:"baseline",  P10:.30, desc:"+ Named entities from context",sees:["query words","NER entities","segment words"],             color:C.amb},
  {m:"Wiki_rel", t:"proposed",  P10:.31, desc:"+ Wikipedia concepts (no NER)",sees:["query words","Wiki concepts","segment Wiki concepts"],    color:C.acc},
  {m:"Ent_Wiki_rel",t:"proposed",P10:.36,desc:"NER + Wiki on both sides",    sees:["query words","NER entities","Wiki concepts","segment words","segment Wiki concepts"], color:C.grn},
];

function Tag({children,color=C.acc,bg=C.accBg,delay=0,large}){
  const [show,setShow]=useState(delay===0);
  useEffect(()=>{if(delay>0){const t=setTimeout(()=>setShow(true),delay);return()=>clearTimeout(t);}else setShow(true);},[delay]);
  return <span style={{fontFamily:mono,fontSize:large?13:10,fontWeight:500,color,background:bg,padding:large?"5px 12px":"3px 8px",borderRadius:large?8:5,display:"inline-block",margin:"2px 3px",opacity:show?1:0,transform:show?"translateY(0)":"translateY(8px)",transition:"all .4s cubic-bezier(.22,1,.36,1)"}}>{children}</span>;
}

function Bar({value,max=.40,color,delay=0}){
  const [w,setW]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>setW((value/max)*100),delay);return()=>clearTimeout(t);},[value,delay]);
  return <div style={{flex:1,height:8,background:C.s2,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${w}%`,background:color,borderRadius:4,transition:"width 1.2s cubic-bezier(.16,1,.3,1)"}}/></div>;
}

function InsightCard({icon,text,delay=0}){
  const [show,setShow]=useState(delay===0);
  useEffect(()=>{if(delay>0){const t=setTimeout(()=>setShow(true),delay);return()=>clearTimeout(t);}else setShow(true);},[delay]);
  return <div style={{display:"flex",gap:10,alignItems:"flex-start",padding:"12px 14px",background:C.s2,borderRadius:10,borderLeft:`3px solid ${C.acc}`,opacity:show?1:0,transform:show?"translateX(0)":"translateX(-10px)",transition:"all .5s ease"}}>
    <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
    <span style={{fontSize:13,color:C.soft,lineHeight:1.55}}>{text}</span>
  </div>;
}

export default function NoisyIRDemo(){
  const [q,setQ]=useState(null);
  const [step,setStep]=useState(0);
  const [met,setMet]=useState("P10");
  const [hovModel,setHovModel]=useState(null);

  const pick=(query)=>{setQ(query);setStep(1);};
  const next=()=>setStep(s=>Math.min(s+1,3));
  const prev=()=>setStep(s=>Math.max(s-1,1));
  const reset=()=>{setQ(null);setStep(0);};

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.ink,fontFamily:body}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideR{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideL{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}
        @keyframes countUp{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
        @keyframes glow{0%,100%{box-shadow:0 0 0 0 ${C.accGlow}}50%{box-shadow:0 0 24px 4px ${C.accGlow}}}
        .hov{transition:all .2s;cursor:pointer} .hov:hover{border-color:${C.acc}!important;box-shadow:0 0 24px ${C.accGlow}}
        .card{background:${C.s1};border:1px solid ${C.brd};border-radius:14px;padding:20px 22px}
        button{font-family:${mono};cursor:pointer}
      `}</style>

      {/* HEADER */}
      <header style={{borderBottom:`1px solid ${C.brd}`,background:C.s1,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${C.acc},${C.vio})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontFamily:disp,fontWeight:800,fontSize:14}}>W</div>
          <div>
            <h1 style={{fontFamily:disp,fontSize:16,fontWeight:800}}>WikiQuery · Proactive IR on Noisy Text</h1>
            <div style={{fontFamily:mono,fontSize:9,color:C.dim,letterSpacing:".07em"}}>PUBLISHED AT CIKM 2022 · ALL DATA FROM PAPER & REPO</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {q&&<div style={{display:"flex",gap:4}}>{[1,2,3].map(i=><div key={i} style={{width:i===step?24:8,height:8,borderRadius:4,background:i<=step?C.acc:C.s3,transition:"all .4s ease"}}/>)}</div>}
          {q&&<button onClick={reset} style={{fontSize:11,color:C.soft,background:C.s2,border:`1px solid ${C.brd}`,borderRadius:6,padding:"4px 12px"}}>Reset</button>}
        </div>
      </header>

      <main style={{maxWidth:940,margin:"0 auto",padding:"28px 20px 100px"}}>
        <div key={q?.id+"_"+step} style={{animation:"fadeUp .4s cubic-bezier(.22,1,.36,1)"}}>

        {/* ═══ SELECT ═══ */}
        {step===0&&(
          <div>
            <div style={{textAlign:"center",marginBottom:36}}>
              <h2 style={{fontFamily:disp,fontSize:32,fontWeight:800,letterSpacing:"-.03em",marginBottom:10}}>
                How Wikipedia Makes Search<br/>Work on Noisy Text
              </h2>
              <p style={{color:C.soft,fontSize:15,maxWidth:560,margin:"0 auto",lineHeight:1.7}}>
                Podcast transcripts from speech recognition are full of errors.
                User queries are short and ambiguous.
                Can structured knowledge from Wikipedia help a search system cut through the noise?
              </p>
            </div>

            <div style={{fontFamily:mono,fontSize:10,color:C.dim,textAlign:"center",marginBottom:16,letterSpacing:".08em"}}>
              PICK A QUERY TO SEE THE SYSTEM IN ACTION
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {QUERIES.map((query,i)=>(
                <div key={query.id} className="card hov" onClick={()=>pick(query)} style={{animation:`fadeUp .4s ease ${i*70}ms both`,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,right:0,width:80,height:80,background:`radial-gradient(circle at top right, ${C.accBg}, transparent)`,borderRadius:"0 14px 0 0"}}/>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <code style={{fontFamily:mono,fontSize:15,color:C.acc,fontWeight:600}}>"{query.original}"</code>
                    <span style={{fontFamily:mono,fontSize:9,color:C.amb,background:C.ambBg,padding:"2px 8px",borderRadius:4,height:"fit-content"}}>{query.type}</span>
                  </div>
                  <p style={{fontSize:13,color:C.soft,lineHeight:1.5,marginBottom:12}}>{query.desc.length>90?query.desc.slice(0,90)+"...":query.desc}</p>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontFamily:mono,fontSize:9,color:C.red}}>❌ {query.wikiQOnly}</span>
                    <span style={{color:C.dim}}>→</span>
                    <span style={{fontFamily:mono,fontSize:9,color:C.grn}}>✓ {query.wikiQContext}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ STEP 1: THE TRANSFORMATION ═══ */}
        {step===1&&q&&(
          <div>
            <div style={{marginBottom:20}}>
              <span style={{fontFamily:mono,fontSize:10,color:C.acc,letterSpacing:".1em"}}>STEP 1 OF 3</span>
              <h2 style={{fontFamily:disp,fontSize:24,fontWeight:800,marginTop:4}}>Query Enrichment — What the System Sees</h2>
            </div>

            {/* The raw query */}
            <div className="card" style={{marginBottom:14,animation:"slideR .4s ease"}}>
              <div style={{fontFamily:mono,fontSize:9,color:C.dim,letterSpacing:".08em",marginBottom:8}}>THE USER TYPES</div>
              <div style={{fontFamily:disp,fontSize:28,fontWeight:800,color:C.ink}}>"{q.original}"</div>
              <div style={{marginTop:8,fontSize:13,color:C.dim}}>Just {q.original.split(" ").length} words. Ambiguous. No context.</div>
            </div>

            {/* Context */}
            <div className="card" style={{marginBottom:14,animation:"slideR .4s ease .1s both"}}>
              <div style={{fontFamily:mono,fontSize:9,color:C.acc,letterSpacing:".08em",marginBottom:8}}>BUT WE HAVE CONTEXT (from user history)</div>
              <div style={{fontSize:14,color:C.soft,lineHeight:1.65,fontStyle:"italic",padding:"12px 16px",background:C.s2,borderRadius:10,borderLeft:`3px solid ${C.acc}`}}>{q.desc}</div>
            </div>

            {/* The transformation — before / after */}
            <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:12,marginBottom:14,alignItems:"stretch"}}>
              {/* BEFORE */}
              <div className="card" style={{borderColor:C.red,borderStyle:"dashed",animation:"slideR .4s ease .2s both"}}>
                <div style={{fontFamily:mono,fontSize:9,color:C.red,marginBottom:10}}>❌ WITHOUT CONTEXT</div>
                <div style={{fontFamily:mono,fontSize:13,color:C.red,fontWeight:600,marginBottom:12}}>{q.wikiQOnly}</div>
                <div style={{fontSize:12,color:C.dim,lineHeight:1.5}}>
                  {q.wikiQOnly.includes("nothing") 
                    ? "The search engine can't resolve any concept from these words alone."
                    : "The search engine picks the wrong concept — not what the user meant at all."}
                </div>
              </div>

              {/* Arrow */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeUp .4s ease .4s both"}}>
                <div style={{fontFamily:disp,fontSize:24,color:C.acc}}>→</div>
              </div>

              {/* AFTER */}
              <div className="card" style={{borderColor:C.grn,animation:"slideL .4s ease .3s both"}}>
                <div style={{fontFamily:mono,fontSize:9,color:C.grn,marginBottom:10}}>✓ WITH CONTEXT</div>
                <div style={{fontFamily:mono,fontSize:13,color:C.grn,fontWeight:600,marginBottom:4}}>{q.wikiQContext}</div>
                <div style={{fontFamily:mono,fontSize:11,color:C.soft,marginBottom:12}}>{q.wikiQContextFull}</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {q.keyWikiConcepts.map((c,i)=><Tag key={c} color={C.accB} bg={C.accBg} delay={500+i*100}>{c}</Tag>)}
                </div>
              </div>
            </div>

            {/* WHY card */}
            <InsightCard icon="💡" text={q.disambigWhy} delay={800}/>

            {/* NER too */}
            <div className="card" style={{marginTop:14,animation:"fadeUp .4s ease 1s both"}}>
              <div style={{fontFamily:mono,fontSize:9,color:C.amb,letterSpacing:".08em",marginBottom:8}}>ALSO EXTRACTED: NAMED ENTITIES (spaCy NER)</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {q.nerTerms.map((t,i)=><Tag key={t} color={C.amb} bg={C.ambBg} delay={1100+i*80}>{t}</Tag>)}
              </div>
              <div style={{fontSize:12,color:C.dim,marginTop:8}}>These come from the DCU model approach — we keep them and add Wikipedia on top.</div>
            </div>

            <div style={{marginTop:18,textAlign:"right"}}>
              <button onClick={next} style={{fontSize:12,color:"#fff",background:C.acc,border:"none",borderRadius:8,padding:"10px 22px",fontWeight:600}}>Next: How Models Compare →</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: WHAT EACH MODEL SEES ═══ */}
        {step===2&&q&&(
          <div>
            <div style={{marginBottom:20}}>
              <span style={{fontFamily:mono,fontSize:10,color:C.acc,letterSpacing:".1em"}}>STEP 2 OF 3</span>
              <h2 style={{fontFamily:disp,fontSize:24,fontWeight:800,marginTop:4}}>What Each Model "Sees"</h2>
              <p style={{color:C.soft,fontSize:13,marginTop:6}}>Same query, same documents — but each model has different information to work with.</p>
            </div>

            <div style={{display:"grid",gap:10}}>
              {TABLE2.map((row,i)=>{
                const best = row.m === "Ent_Wiki_rel";
                return(
                  <div key={row.m}
                    onMouseEnter={()=>setHovModel(row.m)}
                    onMouseLeave={()=>setHovModel(null)}
                    className="card"
                    style={{
                      borderColor:best?C.grn:hovModel===row.m?C.acc:C.brd,
                      boxShadow:best?`0 0 20px ${C.grnBg}`:hovModel===row.m?`0 0 16px ${C.accGlow}`:"none",
                      animation:`slideR .4s ease ${i*100}ms both`,
                      position:"relative",overflow:"hidden",
                    }}>
                    {best&&<div style={{position:"absolute",top:10,right:14,fontFamily:mono,fontSize:9,color:C.grn,background:C.grnBg,padding:"3px 10px",borderRadius:5,fontWeight:600}}>★ BEST</div>}
                    
                    <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:8}}>
                      <span style={{fontFamily:mono,fontSize:14,fontWeight:700,color:best?C.grn:row.color}}>{row.m}</span>
                      <span style={{fontFamily:mono,fontSize:9,color:C.dim,background:C.s3,padding:"2px 7px",borderRadius:4}}>{row.t}</span>
                      <span style={{fontSize:12,color:C.soft}}>{row.desc}</span>
                    </div>
                    
                    {/* What it sees */}
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
                      {row.sees.map((s,j)=>{
                        const isWiki = s.includes("Wiki");
                        const isNer = s.includes("NER");
                        return <Tag key={s} 
                          color={isWiki?C.acc:isNer?C.amb:C.soft} 
                          bg={isWiki?C.accBg:isNer?C.ambBg:C.s3}
                          delay={200+i*100+j*60}
                          large
                        >{s}</Tag>;
                      })}
                    </div>

                    {/* Score bar */}
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontFamily:mono,fontSize:10,color:C.dim,width:60}}>P@10</span>
                      <Bar value={row.P10} color={best?C.grn:row.color} delay={300+i*120}/>
                      <span style={{fontFamily:mono,fontSize:14,fontWeight:best?800:500,color:best?C.grn:C.ink,width:40,textAlign:"right"}}>{row.P10.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <InsightCard icon="🔑" text="The model that combines NER entities AND Wikipedia concepts on both the query and document side wins. Adding structured knowledge to both sides of the matching is what drives the improvement." delay={600}/>

            <div style={{marginTop:16,display:"flex",justifyContent:"space-between"}}>
              <button onClick={prev} style={{fontSize:12,color:C.soft,background:C.s2,border:`1px solid ${C.brd}`,borderRadius:8,padding:"10px 20px"}}>← Back</button>
              <button onClick={next} style={{fontSize:12,color:"#fff",background:C.acc,border:"none",borderRadius:8,padding:"10px 22px",fontWeight:600}}>Next: Why This Scales →</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: RESULTS + WHY IT SCALES ═══ */}
        {step===3&&q&&(
          <div>
            <div style={{marginBottom:20}}>
              <span style={{fontFamily:mono,fontSize:10,color:C.acc,letterSpacing:".1em"}}>STEP 3 OF 3</span>
              <h2 style={{fontFamily:disp,fontSize:24,fontWeight:800,marginTop:4}}>Results & Why This Approach Scales</h2>
            </div>

            {/* Impact numbers */}
            <div style={{background:`linear-gradient(135deg,${C.acc},#1d4ed8)`,borderRadius:14,padding:"28px 26px",color:"#fff",marginBottom:16,animation:"fadeUp .4s ease"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:16}}>
                {[
                  {v:"+20%",s:"Precision improvement",sub:"vs all baselines"},
                  {v:"0.36",s:"Best P@10",sub:"Ent_Wiki_rel model"},
                  {v:"100K+",s:"Episodes indexed",sub:"Spotify Podcast Dataset"},
                ].map((x,i)=>(
                  <div key={x.v} style={{textAlign:"center",animation:`countUp .5s ease ${200+i*150}ms both`}}>
                    <div style={{fontFamily:disp,fontSize:32,fontWeight:800}}>{x.v}</div>
                    <div style={{fontFamily:mono,fontSize:10,opacity:.8}}>{x.s}</div>
                    <div style={{fontFamily:mono,fontSize:9,opacity:.5,marginTop:2}}>{x.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* WHY IT SCALES — the real selling point */}
            <div style={{fontFamily:mono,fontSize:10,color:C.dim,marginBottom:12,letterSpacing:".08em"}}>WHY THIS APPROACH IS INTERESTING</div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              {[
                {icon:"⚡",title:"No GPU required",body:"Uses DPH — a parameter-free probabilistic model. Runs on CPU. No training, no fine-tuning, no neural re-ranking.",delay:100},
                {icon:"🌐",title:"Free, open knowledge base",body:"Wikipedia covers 6M+ topics. The Wikifier API — which links text to Wikipedia concepts — is free and processes millions of documents per day. No proprietary data needed.",delay:200},
                {icon:"🔧",title:"Works on any noisy text",body:"ASR transcripts, PDF extractions, OCR outputs, medical notes — any domain where text is imperfect and queries are ambiguous.",delay:300},
                {icon:"🧩",title:"Composable",body:"Built on PyTerrier — a standard IR toolkit. The Wiki enrichment plugs into any existing retrieval pipeline. Easy to combine with neural models later.",delay:400},
              ].map((card,i)=>(
                <div key={card.title} className="card" style={{animation:`fadeUp .4s ease ${card.delay}ms both`}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <span style={{fontSize:20}}>{card.icon}</span>
                    <span style={{fontFamily:mono,fontSize:12,fontWeight:600,color:C.ink}}>{card.title}</span>
                  </div>
                  <p style={{fontSize:12,color:C.soft,lineHeight:1.55}}>{card.body}</p>
                </div>
              ))}
            </div>

            {/* The bigger picture */}
            <div className="card" style={{background:C.s2,borderColor:C.acc,animation:"fadeUp .5s ease .5s both"}}>
              <div style={{fontFamily:mono,fontSize:9,color:C.acc,letterSpacing:".08em",marginBottom:10}}>THE PATTERN</div>
              <p style={{fontSize:15,color:C.ink,lineHeight:1.7}}>
                The core idea — <strong style={{color:C.acc}}>using structured knowledge to make better decisions from noisy, incomplete signals</strong> — 
                applies far beyond podcast search. Credit scoring with thin files. Ad targeting with sparse engagement data. 
                And where I want to take it next: <strong style={{color:C.grn}}>clinical triage</strong>, combining patient history, imaging, 
                and biomarkers into diagnostic pathways that help patients reach the right care faster.
              </p>
            </div>

            <div style={{marginTop:16}}>
              <button onClick={prev} style={{fontSize:12,color:C.soft,background:C.s2,border:`1px solid ${C.brd}`,borderRadius:8,padding:"10px 20px"}}>← Back</button>
            </div>
          </div>
        )}

        </div>
      </main>
    </div>
  );
}
