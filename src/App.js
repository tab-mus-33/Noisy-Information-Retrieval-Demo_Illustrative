import React, { useState, useEffect } from "react";

const C = {
  bg:"#08090d",s1:"#10121a",s2:"#171b27",s3:"#1e2333",
  brd:"#262d40",ink:"#e8e4dc",soft:"#a09888",dim:"#63594d",
  acc:"#3b82f6",accBg:"rgba(59,130,246,.1)",accGlow:"rgba(59,130,246,.25)",accB:"#60a5fa",
  grn:"#22c55e",grnBg:"rgba(34,197,94,.1)",
  red:"#ef4444",redBg:"rgba(239,68,68,.08)",
  amb:"#f59e0b",ambBg:"rgba(245,158,11,.1)",
};
const mono="'JetBrains Mono',Menlo,monospace";
const body="'Outfit',system-ui,sans-serif";
const disp="'Syne',system-ui,sans-serif";

/*
  ALL DATA BELOW IS REAL — sourced from:
  - topic01.xml (original queries)
  - ent.xml (DCU NER-expanded queries)
  - wikified_query_ent.xml (Ent_Wiki_rel expanded queries)
  - Paper Table 1 (Jaccard + Mann-Whitney)
  - Paper Table 2 (Ranking metrics)
  - Paper Table 3 (Disambiguation)
*/

const QUERIES = [
  {
    id:1,
    original: "coronavirus spread",
    desc: "What were people saying about the spread of the novel coronavirus NCOV-19 in Wuhan at the end of 2019?",
    type: "topical",
    // From ent.xml — DCU model (query + NER entities from description)
    dcu_query: "2019 coronavirus spread wuhan",
    // From wikified_query_ent.xml — Ent_Wiki_rel (query + NER + wiki concepts)
    wiki_query: "2019 coronavirus spread wuhan wiki_covid19_pandemic_in_the_united_states wiki_surrender_of_japan wiki_coronavirus wiki_novel wiki_severe_acute_respiratory_syndrome_coronavirus_2 wiki_covid19 wiki_transmission_medicine wiki_covid19_pandemic_in_the_san_francisco_bay_area wiki_novel_virus wiki_2019 wiki_novel_coronavirus wiki_male wiki_intentionality wiki_end_of_world_war_ii_in_europe wiki_fall_of_constantinople wiki_hadith wiki_gujarat wiki_wuhan",
    // Paper Table 3 — disambiguation
    queryOnly_wiki: "wiki/Coronavirus",
    contextWiki: "wiki/Novel_coronavirus",
    // Paper Table 1
    nRelDocs: 70, nNonRel: 14109, jacRel: 0.027, jacNonRel: 0.007, jacDiff: 0.020, uStat: 25680, pVal: "1.03E-49",
  },
  {
    id:2,
    original: "greta thunberg cross atlantic",
    desc: "What were people saying about Greta Thunberg\u2019s sailing trip across the Atlantic Ocean in the fall of 2019 and its relationship to global climate change?",
    type: "topical",
    dcu_query: "fall greta thunberg\u2019s atlantic thunberg cross ocean 2019",
    wiki_query: "fall greta thunberg\u2019s atlantic thunberg cross ocean 2019 wiki_tourism wiki_fall_of_the_western_roman_empire wiki_2019 wiki_strait_of_gibraltar wiki_intentionality wiki_atlantic_slave_trade wiki_female wiki_2019_philippine_senate_election wiki_atlantic_ocean wiki_world_war_i wiki_hadith wiki_globalization wiki_revolutions_of_1989 wiki_dissolution_of_the_soviet_union wiki_transatlantic_telegraph_cable wiki_sailing wiki_family wiki_social_change wiki_cross wiki_climate_change wiki_member_state_of_the_european_union wiki_gujarat wiki_greta_thunberg",
    queryOnly_wiki: "\u2014 (not detected)",
    contextWiki: "wiki/Greta_Thunberg",
    nRelDocs: 63, nNonRel: 14116, jacRel: 0.023, jacNonRel: 0.011, jacDiff: 0.012, uStat: 47466, pVal: "8.84E-46",
  },
  {
    id:3,
    original: "black hole image",
    desc: "In May 2019 astronomers released the first-ever picture of a black hole. I would like to hear some conversations and educational discussion about the science of astronomy, black holes, and of the picture itself.",
    type: "topical",
    dcu_query: "black image hole 2019 may",
    wiki_query: "black image hole 2019 may wiki_theresa_may wiki_1869_new_jersey_vs2e_rutgers_football_game wiki_2019 wiki_intentionality wiki_astronomer wiki_mumbai wiki_canada wiki_astronomy wiki_dialogue wiki_film wiki_2019_south_african_general_election wiki_preprocessor wiki_english_modal_verbs wiki_black_hole wiki_debate wiki_first_amendment_to_the_united_states_constitution wiki_black_people wiki_county_of_portugal wiki_hearing wiki_science wiki_hole wiki_unixlike wiki_african_americans wiki_computer_vision wiki_education wiki_guerrillero_heroico wiki_electron_hole wiki_may_2019_gulf_of_oman_incident wiki_golf wiki_2019_bournemouth_christchurch_and_poole_council_election",
    queryOnly_wiki: "wiki/Black_hole",
    contextWiki: "wiki/Black_hole",
    nRelDocs: 78, nNonRel: 14101, jacRel: 0.043, jacNonRel: 0.023, jacDiff: 0.019, uStat: 264688, pVal: "1.22E-16",
  },
  {
    id:5,
    original: "daniel ek interview",
    desc: "Someone told me about a podcast interview with Daniel Ek, CEO of Spotify, about the founding and early days of Spotify. I would like to find the show and episode that contains that interview.",
    type: "known item",
    dcu_query: "interview ek spotify days daniel early",
    wiki_query: "interview ek spotify days daniel early wiki_arcade_game wiki_twitter wiki_middle_english wiki_classical_antiquity wiki_azonal wiki_coming_out wiki_podcast wiki_intentionality wiki_clearchannel_station wiki_someone_kelly_clarkson_song wiki_archaeology wiki_the_late_late_show_with_james_corden wiki_like_button wiki_phil_ek wiki_preprocessor wiki_english_modal_verbs wiki_episode wiki_founding_of_rome wiki_book_of_daniel wiki_saliva wiki_talk_show wiki_first_amendment_to_the_united_states_constitution wiki_entrepreneurship wiki_late_show_with_david_letterman wiki_daniel_ek wiki_water wiki_search_engine_optimization wiki_chief_executive_officer wiki_interview wiki_spotify",
    queryOnly_wiki: "\u2014 (not detected)",
    contextWiki: "wiki/Daniel_Ek",
    nRelDocs: 80, nNonRel: 14099, jacRel: 0.039, jacNonRel: 0.029, jacDiff: 0.010, uStat: 455015, pVal: "1.42E-03",
  },
  {
    id:6,
    original: "michelle obama becoming",
    desc: "Former First Lady Michelle Obama\u2019s memoir Becoming was published in early 2019. What were people saying about it?",
    type: "topical",
    dcu_query: "obama michelle first lady becoming obama\u2019s early 2019",
    wiki_query: "obama michelle first lady becoming obama\u2019s early 2019 wiki_2019_united_kingdom_general_election wiki_classical_antiquity wiki_2019 wiki_becoming_philosophy wiki_intentionality wiki_internet_leak wiki_memoir wiki_postsoviet_states wiki_female wiki_becoming_book wiki_first_lady_of_the_united_states wiki_world_war_i wiki_pen_name wiki_ethiopian_airlines_flight_302 wiki_michelle_obama wiki_mary_mother_of_jesus wiki_aphorism wiki_barack_obama wiki_gujarat",
    queryOnly_wiki: "wiki/Becoming_(philosophy)",
    contextWiki: "wiki/Becoming_(book)",
    nRelDocs: 37, nNonRel: 14142, jacRel: 0.027, jacNonRel: 0.010, jacDiff: 0.017, uStat: 35748, pVal: "8.37E-48",
  },
  {
    id:7,
    original: "anna delvey",
    desc: "Anna Sorokina moved to New York City in 2013 and posed as wealthy German heiress Anna Delvey. In 2019 she was convicted of grand larceny, theft, and fraud.",
    type: "topical",
    dcu_query: "sorokina 2013 york anna 2019 german city new delvey",
    wiki_query: "sorokina 2013 york anna 2019 german city new delvey wiki_yulia_tymoshenko wiki_inheritance wiki_upper_class wiki_socialite wiki_2019 wiki_trial_of_derek_chauvin wiki_grand_jury wiki_hospital wiki_intentionality wiki_2018e2809319_manchester_city_f2ec2e_season wiki_female wiki_white_flight wiki_fraud wiki_elizabeth_ii wiki_york_pennsylvania wiki_2013_egyptian_coup_d27c3a9tat wiki_new_york_city wiki_model_art wiki_anna_kulinichsorokina wiki_hadith wiki_new_world wiki_ghislaine_maxwell wiki_trial wiki_saint_anne wiki_theft wiki_sorokina wiki_indian_anna wiki_nomenclature wiki_germany wiki_larceny wiki_alaska wiki_anna_sorokin wiki_york wiki_indictment wiki_2013 wiki_motion_legal wiki_gujarat",
    queryOnly_wiki: "wiki/Indian_anna",
    contextWiki: "wiki/Anna_Sorokin",
    nRelDocs: 77, nNonRel: 14102, jacRel: 0.016, jacNonRel: 0.011, jacDiff: 0.005, uStat: 56322, pVal: "2.80E-44",
  },
  {
    id:8,
    original: "facebook stock prediction",
    desc: "After Facebook\u2019s Q4 2018 earnings call, what were experts\u2019 predictions and expectations for its stock price in 2019?",
    type: "topical",
    dcu_query: "2019 jan stock 2018 prediction 29 facebook",
    wiki_query: "2019 jan stock 2018 prediction 29 facebook wiki_derby_della_capitale wiki_stock wiki_2019_united_kingdom_general_election wiki_2019_j2_league wiki_fandom wiki_social_exclusion wiki_relevant_magazine wiki_archaeology wiki_female wiki_2018_j1_league wiki_bias wiki_peer_review wiki_expected_value wiki_aftermath_of_world_war_ii wiki_time_series wiki_english_modal_verbs wiki_jan_van_eyck wiki_return_on_investment wiki_world_war_i wiki_prediction wiki_performance wiki_share_price wiki_time wiki_alleged_british_use_of_chemical_weapons_in_mesopotamia_in_1920 wiki_competition_law wiki_expert_witness wiki_howitzer wiki_telecommunications wiki_facebook wiki_human_nature wiki_willys_m38a1 wiki_aphrodisiac wiki_used_car wiki_seven_years27_war wiki_dialectic wiki_earnings_call wiki_being wiki_textile wiki_imperial_immediacy wiki_french_wine wiki_fare wiki_fiscal_year",
    queryOnly_wiki: "wiki/Facebook, wiki/Stock",
    contextWiki: "wiki/Facebook, wiki/Stock",
    nRelDocs: 80, nNonRel: 14099, jacRel: 0.032, jacNonRel: 0.023, jacDiff: 0.010, uStat: 271961, pVal: "6.31E-16",
  },
];

// Paper Table 2 — REAL results
const TABLE2 = [
  {m:"DPH",      t:"baseline", NDCG:.48,N30:.30,P10:.32},
  {m:"BM25",     t:"baseline", NDCG:.48,N30:.28,P10:.31},
  {m:"DCU",      t:"baseline", NDCG:.51,N30:.32,P10:.30},
  {m:"Wiki_rel", t:"proposed", NDCG:.49,N30:.29,P10:.31},
  {m:"Ent_Wiki_rel",t:"proposed",NDCG:.51,N30:.30,P10:.36},
];

function Tag({children,color=C.acc,bg=C.accBg,delay=0}){
  const [show,setShow]=useState(delay===0);
  useEffect(()=>{if(delay>0){const t=setTimeout(()=>setShow(true),delay);return()=>clearTimeout(t);}else setShow(true);},[delay]);
  return <span style={{fontFamily:mono,fontSize:10,fontWeight:500,color,background:bg,padding:"3px 8px",borderRadius:5,display:"inline-block",margin:"2px 2px",opacity:show?1:0,transform:show?"translateX(0)":"translateX(-6px)",transition:"all .3s ease"}}>{children}</span>;
}

function Bar({value,max=.55,color,delay=0}){
  const [w,setW]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>setW((value/max)*100),delay);return()=>clearTimeout(t);},[value,delay]);
  return <div style={{flex:1,height:6,background:C.s2,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${w}%`,background:color,borderRadius:3,transition:"width 1s cubic-bezier(.16,1,.3,1)"}}/></div>;
}

function extractWikiConcepts(wikiQuery) {
  return wikiQuery.split(" ").filter(w => w.startsWith("wiki_")).map(w => w.replace("wiki_", "").replace(/_/g, " "));
}

function extractNerTerms(dcuQuery, originalQuery) {
  const orig = new Set(originalQuery.toLowerCase().split(" "));
  return dcuQuery.split(" ").filter(w => !orig.has(w.toLowerCase()) && w.length > 0);
}

export default function NoisyIRRealDemo(){
  const [q,setQ]=useState(null);
  const [step,setStep]=useState(0);
  const [met,setMet]=useState("P10");

  const pick=(query)=>{setQ(query);setStep(1);};
  const next=()=>setStep(s=>Math.min(s+1,4));
  const prev=()=>setStep(s=>Math.max(s-1,1));
  const reset=()=>{setQ(null);setStep(0);};

  const wikiConcepts = q ? extractWikiConcepts(q.wiki_query) : [];
  const nerTerms = q ? extractNerTerms(q.dcu_query, q.original) : [];

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.ink,fontFamily:body}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideR{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideL{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}
        @keyframes blink{50%{opacity:0}}
        @keyframes countUp{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
        @keyframes scanDown{0%{top:0;opacity:1}100%{top:100%;opacity:0}}
        .hov{transition:all .2s;cursor:pointer} .hov:hover{border-color:${C.acc}!important;box-shadow:0 0 20px ${C.accGlow}}
        .card{background:${C.s1};border:1px solid ${C.brd};border-radius:14px;padding:20px 22px}
        button{font-family:${mono};cursor:pointer}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:${C.s3};border-radius:2px}
      `}</style>

      {/* HEADER */}
      <header style={{borderBottom:`1px solid ${C.brd}`,background:C.s1,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${C.acc},#a78bfa)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontFamily:disp,fontWeight:800,fontSize:14}}>W</div>
          <div>
            <h1 style={{fontFamily:disp,fontSize:16,fontWeight:800}}>Proactive IR · Wikipedia Concepts</h1>
            <div style={{fontFamily:mono,fontSize:9,color:C.dim,letterSpacing:".07em"}}>PASIR'22 @ CIKM · ALL DATA FROM PAPER + REPO</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {q && <div style={{display:"flex",gap:4}}>{[1,2,3,4].map(i=><div key={i} style={{width:i===step?24:8,height:8,borderRadius:4,background:i<=step?C.acc:C.s3,transition:"all .4s ease"}}/>)}</div>}
          {q && <button onClick={reset} style={{fontSize:11,color:C.soft,background:C.s2,border:`1px solid ${C.brd}`,borderRadius:6,padding:"4px 12px"}}>Reset</button>}
        </div>
      </header>

      <main style={{maxWidth:940,margin:"0 auto",padding:"28px 20px 100px"}}>
        <div key={q?.id+"_"+step} style={{animation:"fadeUp .4s cubic-bezier(.22,1,.36,1)"}}>

        {/* ═══ SELECT ═══ */}
        {step===0&&(
          <div>
            <div style={{textAlign:"center",marginBottom:32}}>
              <h2 style={{fontFamily:disp,fontSize:30,fontWeight:800,letterSpacing:"-.03em",marginBottom:8}}>Real Query Enrichment</h2>
              <p style={{color:C.soft,fontSize:15,maxWidth:520,margin:"0 auto",lineHeight:1.6}}>
                Every piece of data below comes directly from the <a href="https://github.com/tab-mus-33/Noisy-IR" style={{color:C.acc}}>repo XML files</a> and <a href="https://arxiv.org/abs/2210.09877" style={{color:C.acc}}>paper tables</a>. Nothing is simulated.
              </p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {QUERIES.map((query,i)=>(
                <div key={query.id} className="card hov" onClick={()=>pick(query)} style={{animation:`fadeUp .4s ease ${i*60}ms both`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <code style={{fontFamily:mono,fontSize:13,color:C.acc,fontWeight:600}}>"{query.original}"</code>
                    <span style={{fontFamily:mono,fontSize:9,color:C.amb,background:C.ambBg,padding:"2px 7px",borderRadius:4}}>{query.type}</span>
                  </div>
                  <p style={{fontSize:13,color:C.soft,lineHeight:1.5}}>{query.desc.length>100?query.desc.slice(0,100)+"...":query.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ STEP 1: ENRICHMENT (real XML data) ═══ */}
        {step===1&&q&&(
          <div>
            <div style={{marginBottom:18}}>
              <span style={{fontFamily:mono,fontSize:10,color:C.acc,letterSpacing:".1em"}}>STEP 1 — QUERY ENRICHMENT</span>
              <h2 style={{fontFamily:disp,fontSize:22,fontWeight:800,marginTop:4}}>From Repo: topic01.xml → ent.xml → wikified_query_ent.xml</h2>
              <p style={{color:C.soft,fontSize:13,marginTop:6}}>Three files in the repo show how queries evolve. This is your actual data.</p>
            </div>

            {/* Original */}
            <div className="card" style={{marginBottom:10,animation:"slideR .4s ease"}}>
              <div style={{fontFamily:mono,fontSize:9,color:C.dim,letterSpacing:".08em",marginBottom:6}}>
                topic01.xml — ORIGINAL QUERY
              </div>
              <div style={{fontFamily:mono,fontSize:15,color:C.ink,fontWeight:600}}>"{q.original}"</div>
              <div style={{fontSize:13,color:C.soft,fontStyle:"italic",marginTop:6}}>{q.desc}</div>
            </div>

            {/* DCU (ent.xml) */}
            <div className="card" style={{marginBottom:10,borderColor:C.amb,animation:"slideR .4s ease .15s both"}}>
              <div style={{fontFamily:mono,fontSize:9,color:C.amb,letterSpacing:".08em",marginBottom:6}}>
                ent.xml — DCU MODEL (query + NER entities from description)
              </div>
              <div style={{fontFamily:mono,fontSize:12,color:C.ink,lineHeight:1.8}}>
                {q.dcu_query.split(" ").map((w,i)=>{
                  const isNer = nerTerms.includes(w);
                  return <span key={i} style={isNer?{color:C.amb,background:C.ambBg,padding:"1px 5px",borderRadius:3,margin:"0 2px",fontWeight:600}:{margin:"0 2px"}}>{w}</span>;
                })}
              </div>
              <div style={{fontFamily:mono,fontSize:10,color:C.dim,marginTop:6}}>
                NER added: {nerTerms.map(t=><Tag key={t} color={C.amb} bg={C.ambBg}>{t}</Tag>)}
              </div>
            </div>

            {/* Ent_Wiki_rel (wikified_query_ent.xml) */}
            <div className="card" style={{borderColor:C.acc,animation:"slideR .4s ease .3s both"}}>
              <div style={{fontFamily:mono,fontSize:9,color:C.acc,letterSpacing:".08em",marginBottom:6}}>
                wikified_query_ent.xml — ENT_WIKI_REL (query + NER + Wiki concepts)
              </div>
              <div style={{fontFamily:mono,fontSize:11,color:C.soft,lineHeight:1.8,maxHeight:120,overflowY:"auto",padding:"8px 10px",background:C.s2,borderRadius:8}}>
                {q.wiki_query}
              </div>
              <div style={{fontFamily:mono,fontSize:10,color:C.dim,marginTop:8}}>
                Wiki concepts added ({wikiConcepts.length}):
              </div>
              <div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:4,maxHeight:80,overflowY:"auto"}}>
                {wikiConcepts.map((c,i)=><Tag key={c} color={C.accB} bg={C.accBg} delay={400+i*60}>{c}</Tag>)}
              </div>
            </div>

            <div style={{marginTop:16,textAlign:"right"}}>
              <button onClick={next} style={{fontSize:12,color:"#fff",background:C.acc,border:"none",borderRadius:8,padding:"10px 22px",fontWeight:600}}>Next: Disambiguation →</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: DISAMBIGUATION (Table 3) ═══ */}
        {step===2&&q&&(
          <div>
            <div style={{marginBottom:18}}>
              <span style={{fontFamily:mono,fontSize:10,color:C.acc,letterSpacing:".1em"}}>STEP 2 — DISAMBIGUATION</span>
              <h2 style={{fontFamily:disp,fontSize:22,fontWeight:800,marginTop:4}}>From Paper: Table 3 — Query Word Disambiguation</h2>
              <p style={{color:C.soft,fontSize:13,marginTop:6}}>Wikifying query-only vs query+description. Direct from the paper.</p>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
              <div className="card" style={{borderStyle:"dashed",borderColor:C.red,animation:"slideR .4s ease"}}>
                <div style={{fontFamily:mono,fontSize:10,color:C.red,marginBottom:10}}>QUERY ONLY → Wikifier</div>
                <div style={{fontFamily:mono,fontSize:14,color:q.queryOnly_wiki.includes("not detected")?C.red:C.red,fontWeight:600,padding:"12px",background:C.redBg,borderRadius:8,textAlign:"center"}}>
                  {q.queryOnly_wiki}
                </div>
                <div style={{fontFamily:mono,fontSize:11,color:C.red,marginTop:8}}>
                  {q.queryOnly_wiki.includes("not detected")?"⚠ No concept found":"⚠ Wrong / ambiguous concept"}
                </div>
              </div>

              <div className="card" style={{borderColor:C.grn,animation:"slideL .4s ease .15s both"}}>
                <div style={{fontFamily:mono,fontSize:10,color:C.grn,marginBottom:10}}>QUERY + DESCRIPTION → Wikifier</div>
                <div style={{fontFamily:mono,fontSize:14,color:C.grn,fontWeight:600,padding:"12px",background:C.grnBg,borderRadius:8,textAlign:"center"}}>
                  {q.contextWiki}
                </div>
                <div style={{fontFamily:mono,fontSize:11,color:C.grn,marginTop:8}}>
                  ✓ Correct concept identified with context
                </div>
              </div>
            </div>

            {/* Show all 7 queries disambiguation at once */}
            <div className="card" style={{animation:"fadeUp .4s ease .3s both"}}>
              <div style={{fontFamily:mono,fontSize:9,color:C.dim,marginBottom:10}}>TABLE 3 — ALL QUERIES</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontFamily:mono,fontSize:11}}>
                  <thead>
                    <tr style={{borderBottom:`1px solid ${C.s3}`}}>
                      <th style={{textAlign:"left",padding:"6px 8px",color:C.dim,fontWeight:500}}>Query</th>
                      <th style={{textAlign:"left",padding:"6px 8px",color:C.red,fontWeight:500}}>Query Only</th>
                      <th style={{textAlign:"left",padding:"6px 8px",color:C.grn,fontWeight:500}}>Query + Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {QUERIES.map((row,i)=>(
                      <tr key={row.id} style={{borderBottom:`1px solid ${C.s2}`,background:row.id===q.id?C.accBg:"transparent"}}>
                        <td style={{padding:"6px 8px",color:row.id===q.id?C.acc:C.soft}}>{row.original}</td>
                        <td style={{padding:"6px 8px",color:C.red}}>{row.queryOnly_wiki}</td>
                        <td style={{padding:"6px 8px",color:C.grn}}>{row.contextWiki}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{marginTop:16,display:"flex",justifyContent:"space-between"}}>
              <button onClick={prev} style={{fontSize:12,color:C.soft,background:C.s2,border:`1px solid ${C.brd}`,borderRadius:8,padding:"10px 20px"}}>← Back</button>
              <button onClick={next} style={{fontSize:12,color:"#fff",background:C.acc,border:"none",borderRadius:8,padding:"10px 22px",fontWeight:600}}>Next: Relevance Signal →</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: JACCARD (Table 1) ═══ */}
        {step===3&&q&&(
          <div>
            <div style={{marginBottom:18}}>
              <span style={{fontFamily:mono,fontSize:10,color:C.acc,letterSpacing:".1em"}}>STEP 3 — RELEVANCE SIGNAL</span>
              <h2 style={{fontFamily:disp,fontSize:22,fontWeight:800,marginTop:4}}>From Paper: Table 1 — Jaccard Similarity + Mann-Whitney U</h2>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
              <div className="card" style={{animation:"slideR .4s ease"}}>
                <div style={{fontFamily:mono,fontSize:9,color:C.grn,marginBottom:10}}>THIS QUERY: "{q.original}"</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div style={{background:C.grnBg,borderRadius:8,padding:14,textAlign:"center"}}>
                    <div style={{fontFamily:mono,fontSize:9,color:C.grn}}>RELEVANT ({q.nRelDocs} docs)</div>
                    <div style={{fontFamily:disp,fontSize:30,fontWeight:800,color:C.grn,animation:"countUp .5s ease .2s both"}}>{q.jacRel}</div>
                  </div>
                  <div style={{background:C.redBg,borderRadius:8,padding:14,textAlign:"center"}}>
                    <div style={{fontFamily:mono,fontSize:9,color:C.red}}>NON-REL ({q.nNonRel.toLocaleString()})</div>
                    <div style={{fontFamily:disp,fontSize:30,fontWeight:800,color:C.red,animation:"countUp .5s ease .4s both"}}>{q.jacNonRel}</div>
                  </div>
                </div>
                <div style={{fontFamily:mono,fontSize:11,color:C.grn,textAlign:"center"}}>
                  Δ = {q.jacDiff} · U = {q.uStat.toLocaleString()} · p = {q.pVal}
                </div>
              </div>

              <div className="card" style={{animation:"slideL .4s ease .15s both"}}>
                <div style={{fontFamily:mono,fontSize:9,color:C.dim,marginBottom:10}}>TABLE 1 — ALL QUERIES</div>
                <div style={{fontSize:12}}>
                  {QUERIES.map((row,i)=>(
                    <div key={row.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,animation:`slideR .3s ease ${i*80}ms both`}}>
                      <span style={{fontFamily:mono,fontSize:10,width:70,color:row.id===q.id?C.acc:C.dim,fontWeight:row.id===q.id?700:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.original}</span>
                      <Bar value={row.jacRel} max={0.05} color={C.grn} delay={200+i*80}/>
                      <Bar value={row.jacNonRel} max={0.05} color={C.red} delay={200+i*80}/>
                      <span style={{fontFamily:mono,fontSize:9,color:C.grn,width:40}}>p&lt;.01</span>
                    </div>
                  ))}
                  <div style={{fontFamily:mono,fontSize:9,color:C.dim,marginTop:6}}>
                    <span style={{color:C.grn}}>■</span> relevant &nbsp; <span style={{color:C.red}}>■</span> non-relevant · All significant (Mann-Whitney U)
                  </div>
                </div>
              </div>
            </div>

            <div style={{display:"flex",justifyContent:"space-between"}}>
              <button onClick={prev} style={{fontSize:12,color:C.soft,background:C.s2,border:`1px solid ${C.brd}`,borderRadius:8,padding:"10px 20px"}}>← Back</button>
              <button onClick={next} style={{fontSize:12,color:"#fff",background:C.acc,border:"none",borderRadius:8,padding:"10px 22px",fontWeight:600}}>Next: Results →</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 4: RESULTS (Table 2) ═══ */}
        {step===4&&q&&(
          <div>
            <div style={{marginBottom:18}}>
              <span style={{fontFamily:mono,fontSize:10,color:C.acc,letterSpacing:".1em"}}>STEP 4 — RESULTS</span>
              <h2 style={{fontFamily:disp,fontSize:22,fontWeight:800,marginTop:4}}>From Paper: Table 2 — Ranking Performance</h2>
            </div>

            <div style={{display:"flex",gap:6,marginBottom:16}}>
              {[["P10","P@10"],["NDCG","NDCG"],["N30","NDCG@30"]].map(([k,l])=>(
                <button key={k} onClick={()=>setMet(k)} style={{
                  fontSize:11,padding:"5px 14px",borderRadius:6,
                  background:met===k?C.accBg:C.s2,border:`1px solid ${met===k?C.acc:C.brd}`,
                  color:met===k?C.acc:C.soft,fontWeight:met===k?600:400,
                }}>{l}</button>
              ))}
            </div>

            <div className="card" style={{marginBottom:16}}>
              {TABLE2.map((row,i)=>{
                const val=row[met];
                const best=val===Math.max(...TABLE2.map(r=>r[met]));
                return(
                  <div key={row.m} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<TABLE2.length-1?`1px solid ${C.s2}`:"none",animation:`slideR .35s ease ${i*80}ms both`}}>
                    <span style={{fontFamily:mono,fontSize:12,width:95,color:best?C.acc:C.soft,fontWeight:best?700:400}}>{row.m}</span>
                    <Tag color={row.t==="proposed"?C.acc:C.dim} bg={row.t==="proposed"?C.accBg:C.s3} delay={0}>{row.t}</Tag>
                    <Bar value={val} max={.55} color={best?C.acc:row.t==="proposed"?C.accB:C.s3} delay={150+i*100}/>
                    <span style={{fontFamily:mono,fontSize:13,width:36,textAlign:"right",color:best?C.acc:C.ink,fontWeight:best?700:400}}>{val.toFixed(2)}</span>
                  </div>
                );
              })}
              <div style={{fontFamily:mono,fontSize:9,color:C.dim,marginTop:8}}>
                Podcast Small · 8 training queries · ~14K segments · higher is better
              </div>
            </div>

            {/* Impact */}
            <div style={{background:`linear-gradient(135deg,${C.acc},#1d4ed8)`,borderRadius:14,padding:"26px 24px",color:"#fff",animation:"fadeUp .5s ease .2s both"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>
                {[{v:"+20%",s:"P@10 improvement"},{v:"0.36",s:"Best Precision@10"},{v:"8/8",s:"Significant (p<.01)"}].map((x,i)=>(
                  <div key={x.v} style={{textAlign:"center",animation:`countUp .5s ease ${400+i*150}ms both`}}>
                    <div style={{fontFamily:disp,fontSize:30,fontWeight:800}}>{x.v}</div>
                    <div style={{fontFamily:mono,fontSize:10,opacity:.7}}>{x.s}</div>
                  </div>
                ))}
              </div>
              <p style={{fontSize:13,lineHeight:1.6,opacity:.9}}>
                Wikipedia concepts improve early precision on noisy ASR text using lightweight probabilistic models (DPH). 
                No neural re-ranking. No GPU. Directly applicable to any domain with noisy text and ambiguous queries.
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
