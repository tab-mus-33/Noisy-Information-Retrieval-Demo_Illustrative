import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ═══ DESIGN SYSTEM ═══ dark mode, cinematic, high contrast for screen recording */
const C = {
  bg: '#08090d',
  s1: '#10121a',
  s2: '#171b27',
  s3: '#1e2333',
  brd: '#262d40',
  brdH: '#3a4463',
  ink: '#e8e4dc',
  soft: '#a09888',
  dim: '#63594d',
  acc: '#3b82f6',
  accBg: 'rgba(59,130,246,.1)',
  accGlow: 'rgba(59,130,246,.25)',
  accBright: '#60a5fa',
  grn: '#22c55e',
  grnBg: 'rgba(34,197,94,.1)',
  grnGlow: 'rgba(34,197,94,.2)',
  red: '#ef4444',
  redBg: 'rgba(239,68,68,.08)',
  amb: '#f59e0b',
  ambBg: 'rgba(245,158,11,.1)',
  vio: '#a78bfa',
};
const mono = "'JetBrains Mono',Menlo,monospace";
const body = "'Outfit',system-ui,sans-serif";
const disp = "'Syne',system-ui,sans-serif";

/* ═══ DATA (from paper) ═══ */
const QUERIES = [
  {
    id: 1,
    q: 'coronavirus spread',
    type: 'topical',
    desc: 'What were people saying about the spread of the novel coronavirus NCOV-19 in Wuhan at the end of 2019?',
    wQ: [{ t: 'Coronavirus', pr: 0.039, cls: 'group of viruses', ok: false }],
    wQD: [
      { t: '2019-20 coronavirus pandemic', pr: 0.084, cls: 'pandemic' },
      { t: 'Wuhan', pr: 0.041, cls: 'city' },
      {
        t: 'Severe acute respiratory syndrome',
        pr: 0.029,
        cls: 'infectious disease',
      },
    ],
    ner: ['NCOV-19', 'Wuhan'],
    segs: [
      {
        d: 'spotify:episode:3x7Bq:120-240',
        title: 'The Daily — How Bad Will It Get?',
        txt: "the virus spreading through wuhan seafood market respiratory illness unlike anything we've seen",
        wiki: 'COVID-19_pandemic Wuhan Seafood_market Respiratory_disease',
        r: 4,
      },
      {
        d: 'spotify:episode:7kLm2:60-180',
        title: 'Science Vs — Coronavirus Facts',
        txt: 'novel coronavirus officially designated sars cov two initial spread from animal to human transmission',
        wiki: 'Coronavirus SARS-CoV-2 Zoonosis WHO',
        r: 3,
      },
      {
        d: 'spotify:episode:1nRp4:300-420',
        title: 'Up First — Virus Outbreak',
        txt: 'chinese authorities reporting new pneumonia cases doctors noticing unusual cluster',
        wiki: 'Pneumonia Wuhan China',
        r: 2,
      },
    ],
    jR: 0.027,
    jNR: 0.007,
    pV: '1.03×10⁻⁴⁹',
    dis: 'Generic "Coronavirus" → specific "2019-20 coronavirus pandemic" + geographic "Wuhan"',
  },
  {
    id: 2,
    q: 'michelle obama becoming',
    type: 'topical',
    desc: "Former First Lady Michelle Obama's memoir Becoming was published in early 2019. What were people saying about it?",
    wQ: [{ t: 'Becoming (philosophy)', pr: 0.002, cls: 'concept', ok: false }],
    wQD: [
      { t: 'Michelle Obama', pr: 0.063, cls: 'human' },
      { t: 'Becoming (Michelle Obama book)', pr: 0.018, cls: 'book' },
      {
        t: 'First Lady of the United States',
        pr: 0.013,
        cls: 'political office',
      },
    ],
    ner: ['Michelle Obama'],
    segs: [
      {
        d: 'spotify:episode:9pQr1:180-300',
        title: 'SuperSoul — Michelle Obama',
        txt: 'her journey from chicago south side to the white house deeply personal memoir',
        wiki: 'Michelle_Obama Becoming_(book) Chicago White_House',
        r: 4,
      },
      {
        d: 'spotify:episode:4mNx3:0-120',
        title: 'Book Club — Becoming Review',
        txt: 'sold more than ten million copies candidly discussing experiences as first lady',
        wiki: 'Michelle_Obama First_Lady Book_tour',
        r: 3,
      },
    ],
    jR: 0.027,
    jNR: 0.01,
    pV: '8.37×10⁻⁴⁸',
    dis: '"Becoming (philosophy)" → "Becoming (book)" — context reveals the memoir, not abstract concept',
  },
  {
    id: 3,
    q: 'anna delvey',
    type: 'topical',
    desc: 'Anna Sorokina posed as wealthy German heiress Anna Delvey. In 2019 she was convicted of grand larceny, theft, and fraud.',
    wQ: [{ t: 'Indian anna', pr: 0.001, cls: 'unit of currency', ok: false }],
    wQD: [
      { t: 'Anna Sorokin', pr: 0.011, cls: 'human' },
      { t: 'Grand larceny', pr: 0.005, cls: 'crime' },
      { t: 'New York City', pr: 0.103, cls: 'city' },
    ],
    ner: ['Anna Sorokina', 'Anna Delvey', 'New York City'],
    segs: [
      {
        d: 'spotify:episode:2qRx5:60-180',
        title: 'Criminal — The Fake Heiress',
        txt: 'convinced new york elite she was a german heiress worth sixty million euros',
        wiki: 'Anna_Sorokin Fraud New_York_City',
        r: 4,
      },
      {
        d: 'spotify:episode:8nKw1:120-240',
        title: 'Swindled — Fraud Case',
        txt: 'trial in manhattan supreme court found guilty on multiple counts of larceny',
        wiki: 'Anna_Sorokin Grand_larceny Manhattan',
        r: 3,
      },
    ],
    jR: 0.016,
    jNR: 0.011,
    pV: '2.80×10⁻⁴⁴',
    dis: '"Indian anna" (currency!) → "Anna Sorokin" — completely wrong without context',
  },
  {
    id: 4,
    q: 'greta thunberg cross atlantic',
    type: 'topical',
    desc: "What were people saying about Greta Thunberg's sailing trip across the Atlantic Ocean and climate change?",
    wQ: [],
    wQD: [
      { t: 'Greta Thunberg', pr: 0.025, cls: 'human' },
      { t: 'Atlantic Ocean', pr: 0.051, cls: 'ocean' },
      { t: 'Climate change', pr: 0.042, cls: 'environmental issue' },
    ],
    ner: ['Greta Thunberg', 'Atlantic Ocean'],
    segs: [
      {
        d: 'spotify:episode:5rTq2:0-120',
        title: 'Sustainability — Teen Climate Activist',
        txt: 'thunberg zero carbon yacht crossing malizia two fitted with solar panels atlantic voyage',
        wiki: 'Greta_Thunberg Atlantic_Ocean Climate_change Sailing',
        r: 4,
      },
    ],
    jR: 0.023,
    jNR: 0.011,
    pV: '8.84×10⁻⁴⁶',
    dis: 'No concepts from query alone — context enables all three: Greta Thunberg, Atlantic Ocean, Climate change',
  },
];

const TABLE2 = [
  {
    m: 'BM25',
    t: 'baseline',
    NDCG: 0.48,
    N30: 0.28,
    P10: 0.31,
    f: { qt: 1, de: 0, qw: 0, dw: 0, st: 1, sw: 0 },
  },
  {
    m: 'DPH',
    t: 'baseline',
    NDCG: 0.48,
    N30: 0.3,
    P10: 0.32,
    f: { qt: 1, de: 0, qw: 0, dw: 0, st: 1, sw: 0 },
  },
  {
    m: 'DCU',
    t: 'baseline',
    NDCG: 0.51,
    N30: 0.32,
    P10: 0.3,
    f: { qt: 1, de: 1, qw: 0, dw: 0, st: 1, sw: 0 },
  },
  {
    m: 'Wiki_rel',
    t: 'proposed',
    NDCG: 0.49,
    N30: 0.29,
    P10: 0.31,
    f: { qt: 1, de: 0, qw: 1, dw: 1, st: 1, sw: 1 },
  },
  {
    m: 'Ent_Wiki_rel',
    t: 'proposed',
    NDCG: 0.51,
    N30: 0.3,
    P10: 0.36,
    f: { qt: 1, de: 1, qw: 1, dw: 1, st: 1, sw: 1 },
  },
];

/* ═══ ANIMATION HELPERS ═══ */
function useStagger(items, baseDelay = 0, gap = 120) {
  const [visible, setVisible] = useState([]);
  useEffect(() => {
    setVisible([]);
    const timers = items.map((_, i) =>
      setTimeout(() => setVisible((v) => [...v, i]), baseDelay + i * gap)
    );
    return () => timers.forEach(clearTimeout);
  }, [items.length, baseDelay]);
  return visible;
}

function TypeWriter({ text, speed = 20, delay = 0, onDone, mono: isMono }) {
  const [shown, setShown] = useState('');
  const [started, setStarted] = useState(false);
  useEffect(() => {
    setShown('');
    setStarted(false);
    const d = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(d);
  }, [text, delay]);
  useEffect(() => {
    if (!started) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [started, text, speed]);
  return (
    <span style={isMono ? { fontFamily: mono } : {}}>
      {shown}
      <span
        style={{
          opacity: shown.length < text.length && started ? 1 : 0,
          color: C.acc,
          animation: 'blink 1s step-end infinite',
        }}
      >
        ▎
      </span>
    </span>
  );
}

function AnimBar({ value, max = 0.55, color, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW((value / max) * 100), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div
      style={{
        flex: 1,
        height: 6,
        background: C.s2,
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${w}%`,
          background: color,
          borderRadius: 3,
          transition: 'width 1.2s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </div>
  );
}

function Dots({ n }) {
  return (
    <span style={{ display: 'inline-flex', gap: 3 }}>
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: i <= n ? C.grn : C.s3,
          }}
        />
      ))}
    </span>
  );
}

function Tag({ children, color = C.acc, bg = C.accBg, delay = 0 }) {
  const [show, setShow] = useState(delay === 0);
  useEffect(() => {
    if (delay > 0) {
      const t = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(t);
    } else setShow(true);
  }, [delay]);
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: 11,
        fontWeight: 500,
        color,
        background: bg,
        padding: '3px 10px',
        borderRadius: 6,
        display: 'inline-block',
        margin: '2px 3px',
        opacity: show ? 1 : 0,
        transform: show ? 'translateX(0)' : 'translateX(-8px)',
        transition: 'all .35s cubic-bezier(.22,1,.36,1)',
      }}
    >
      {children}
    </span>
  );
}

function GlowCard({
  children,
  active,
  glow = C.accGlow,
  border = C.brd,
  style: s = {},
}) {
  return (
    <div
      style={{
        background: C.s1,
        border: `1px solid ${active ? C.acc : border}`,
        borderRadius: 14,
        padding: '20px 22px',
        boxShadow: active
          ? `0 0 30px ${glow}, inset 0 1px 0 rgba(255,255,255,.03)`
          : `0 2px 8px rgba(0,0,0,.2)`,
        transition: 'all .4s ease',
        ...s,
      }}
    >
      {children}
    </div>
  );
}

function StepIndicator({ current, total }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 28 : 8,
            height: 8,
            borderRadius: 4,
            background:
              i === current ? C.acc : i < current ? C.accBright : C.s3,
            transition: 'all .4s cubic-bezier(.22,1,.36,1)',
            opacity: i <= current ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}

/* ═══ MAIN ═══ */
export default function NoisyIRDemo() {
  const [q, setQ] = useState(null);
  const [step, setStep] = useState(0); // 0=select, 1=wikify, 2=ner, 3=index, 4=retrieve, 5=eval
  const [met, setMet] = useState('P10');
  const [jsonRevealed, setJsonRevealed] = useState(false);
  const [jsonRevealed2, setJsonRevealed2] = useState(false);

  const pick = (query) => {
    setQ(query);
    setStep(1);
    setJsonRevealed(false);
    setJsonRevealed2(false);
  };
  const next = () => {
    setStep((s) => Math.min(s + 1, 5));
    setJsonRevealed(false);
    setJsonRevealed2(false);
  };
  const prev = () => setStep((s) => Math.max(s - 1, 1));
  const reset = () => {
    setQ(null);
    setStep(0);
  };

  const nerVis = useStagger(q?.ner || [], 300, 200);
  const wikiVis = useStagger(q?.wQD || [], 400, 250);
  const segVis = useStagger(q?.segs || [], 200, 180);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        color: C.ink,
        fontFamily: body,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideR{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideL{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}
        @keyframes blink{50%{opacity:0}}
        @keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 ${C.accGlow}}50%{box-shadow:0 0 20px 4px ${C.accGlow}}}
        @keyframes scanDown{0%{top:0;opacity:1}100%{top:100%;opacity:0}}
        @keyframes countUp{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
        .hov{transition:all .2s ease;cursor:pointer} .hov:hover{border-color:${C.acc}!important;box-shadow:0 0 20px ${C.accGlow};}
        button{font-family:${mono};cursor:pointer}
        ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-thumb{background:${C.s3};border-radius:2px}
      `}</style>

      {/* ═══ HEADER ═══ */}
      <header
        style={{
          borderBottom: `1px solid ${C.brd}`,
          background: C.s1,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: `linear-gradient(135deg,${C.acc},${C.vio})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontFamily: disp,
              fontWeight: 800,
              fontSize: 15,
            }}
          >
            W
          </div>
          <div>
            <h1
              style={{
                fontFamily: disp,
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: '-.02em',
                color: C.ink,
              }}
            >
              WikiQuery
            </h1>
            <div
              style={{
                fontFamily: mono,
                fontSize: 9,
                color: C.dim,
                letterSpacing: '.08em',
              }}
            >
              PROACTIVE IR · WIKIPEDIA CONCEPTS · NOISY TEXT
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {q && <StepIndicator current={step - 1} total={5} />}
          {q && (
            <button
              onClick={reset}
              style={{
                fontSize: 11,
                color: C.soft,
                background: C.s2,
                border: `1px solid ${C.brd}`,
                borderRadius: 7,
                padding: '5px 14px',
              }}
            >
              Reset
            </button>
          )}
        </div>
      </header>

      <main
        style={{ maxWidth: 980, margin: '0 auto', padding: '28px 20px 120px' }}
      >
        <div
          key={q?.id + '_' + step}
          style={{ animation: 'fadeUp .45s cubic-bezier(.22,1,.36,1)' }}
        >
          {/* ═══ STEP 0: SELECT ═══ */}
          {step === 0 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <h2
                  style={{
                    fontFamily: disp,
                    fontSize: 34,
                    fontWeight: 800,
                    letterSpacing: '-.03em',
                    marginBottom: 8,
                  }}
                >
                  Live Query Enrichment
                </h2>
                <p
                  style={{
                    color: C.soft,
                    fontSize: 16,
                    maxWidth: 540,
                    margin: '0 auto',
                    lineHeight: 1.6,
                  }}
                >
                  Watch a short, ambiguous podcast query get transformed through
                  Wikipedia concept linking — improving precision by{' '}
                  <span style={{ color: C.acc, fontWeight: 700 }}>20%</span> on
                  noisy ASR text.
                </p>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                }}
              >
                {QUERIES.map((query, i) => (
                  <div
                    key={query.id}
                    className="hov"
                    onClick={() => pick(query)}
                    style={{
                      background: C.s1,
                      border: `1px solid ${C.brd}`,
                      borderRadius: 14,
                      padding: '18px 20px',
                      animation: `fadeUp .4s ease ${i * 80}ms both`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 6,
                      }}
                    >
                      <code
                        style={{
                          fontFamily: mono,
                          fontSize: 14,
                          color: C.acc,
                          fontWeight: 600,
                        }}
                      >
                        "{query.q}"
                      </code>
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: 9,
                          color: C.amb,
                          background: C.ambBg,
                          padding: '2px 8px',
                          borderRadius: 4,
                        }}
                      >
                        {query.type}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: C.soft,
                        lineHeight: 1.5,
                        marginBottom: 10,
                      }}
                    >
                      {query.desc}
                    </p>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {query.wQD.map((w) => (
                        <span
                          key={w.t}
                          style={{
                            fontFamily: mono,
                            fontSize: 9,
                            color: C.accBright,
                            background: C.accBg,
                            padding: '2px 7px',
                            borderRadius: 4,
                          }}
                        >
                          {w.t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ STEP 1: WIKIFY ═══ */}
          {step === 1 && q && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: C.acc,
                    letterSpacing: '.1em',
                  }}
                >
                  STEP 1 OF 5
                </span>
                <h2
                  style={{
                    fontFamily: disp,
                    fontSize: 24,
                    fontWeight: 800,
                    marginTop: 4,
                  }}
                >
                  Wikifier API — Disambiguation
                </h2>
              </div>

              {/* Query display */}
              <GlowCard active style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: C.dim,
                    marginBottom: 6,
                  }}
                >
                  QUERY
                </div>
                <div
                  style={{
                    fontFamily: disp,
                    fontSize: 22,
                    fontWeight: 800,
                    color: C.acc,
                    marginBottom: 8,
                  }}
                >
                  <TypeWriter text={`"${q.q}"`} speed={40} mono />
                </div>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: C.dim,
                    marginBottom: 4,
                  }}
                >
                  CONTEXT (USER HISTORY PROXY)
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: C.soft,
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    padding: '10px 14px',
                    background: C.s2,
                    borderRadius: 8,
                    borderLeft: `3px solid ${C.acc}`,
                  }}
                >
                  <TypeWriter text={q.desc} speed={12} delay={600} />
                </div>
              </GlowCard>

              {/* Side by side API */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                {/* WRONG */}
                <GlowCard
                  active={false}
                  glow={C.redBg}
                  border={C.red}
                  style={{
                    borderStyle: 'dashed',
                    animation: 'slideR .5s ease .8s both',
                  }}
                >
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      color: C.red,
                      marginBottom: 8,
                      letterSpacing: '.06em',
                    }}
                  >
                    ✕ QUERY ONLY → wikifier.org
                  </div>
                  <div
                    style={{
                      background: '#0c0d12',
                      borderRadius: 8,
                      padding: '12px 14px',
                      fontFamily: mono,
                      fontSize: 11,
                      color: '#8a7e6e',
                      lineHeight: 1.7,
                      marginBottom: 10,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {!jsonRevealed && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: 0,
                          height: 3,
                          background: `linear-gradient(90deg,transparent,${C.red},transparent)`,
                          animation: 'scanDown 1.5s ease forwards',
                        }}
                        onAnimationEnd={() => setJsonRevealed(true)}
                      />
                    )}
                    <pre
                      style={{
                        opacity: jsonRevealed ? 1 : 0.3,
                        transition: 'opacity .5s ease',
                      }}
                    >
                      {q.wQ.length === 0
                        ? `{\n  "annotations": []\n}`
                        : `{\n  "annotations": [\n    {\n      "title": "${q.wQ[0].t}",\n      "pageRank": ${q.wQ[0].pr},\n      "wikiDataClasses": [\n        {"enLabel": "${q.wQ[0].cls}"}\n      ]\n    }\n  ]\n}`}
                    </pre>
                  </div>
                  {jsonRevealed && (
                    <div
                      style={{
                        fontSize: 13,
                        color: C.red,
                        fontWeight: 600,
                        animation: 'fadeIn .4s ease',
                      }}
                    >
                      {q.wQ.length === 0
                        ? '⚠ Nothing detected'
                        : `⚠ Wrong: "${q.wQ[0].t}"`}
                    </div>
                  )}
                </GlowCard>

                {/* CORRECT */}
                <GlowCard
                  active={false}
                  glow={C.grnGlow}
                  border={C.grn}
                  style={{ animation: 'slideL .5s ease 1s both' }}
                >
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      color: C.grn,
                      marginBottom: 8,
                      letterSpacing: '.06em',
                    }}
                  >
                    ✓ QUERY + CONTEXT → wikifier.org
                  </div>
                  <div
                    style={{
                      background: '#0c0d12',
                      borderRadius: 8,
                      padding: '12px 14px',
                      fontFamily: mono,
                      fontSize: 11,
                      color: '#8a7e6e',
                      lineHeight: 1.7,
                      marginBottom: 10,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {!jsonRevealed2 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: 0,
                          height: 3,
                          background: `linear-gradient(90deg,transparent,${C.grn},transparent)`,
                          animation: 'scanDown 1.8s ease .3s forwards',
                        }}
                        onAnimationEnd={() => setJsonRevealed2(true)}
                      />
                    )}
                    <pre
                      style={{
                        opacity: jsonRevealed2 ? 1 : 0.3,
                        transition: 'opacity .5s ease',
                      }}
                    >{`{\n  "annotations": [${q.wQD
                      .map(
                        (w) =>
                          `\n    {\n      "title": "${w.t}",\n      "pageRank": ${w.pr},\n      "wikiDataClasses": [\n        {"enLabel": "${w.cls}"}\n      ]\n    }`
                      )
                      .join(',')}\n  ]\n}`}</pre>
                  </div>
                  {jsonRevealed2 && (
                    <div
                      style={{
                        fontSize: 13,
                        color: C.grn,
                        fontWeight: 600,
                        animation: 'fadeIn .4s ease',
                      }}
                    >
                      ✓ {q.dis}
                    </div>
                  )}
                </GlowCard>
              </div>

              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={next}
                  style={{
                    fontSize: 12,
                    color: '#fff',
                    background: C.acc,
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 24px',
                    fontWeight: 600,
                  }}
                >
                  Next: NER + Enrichment →
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 2: NER + ENRICHMENT ═══ */}
          {step === 2 && q && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: C.acc,
                    letterSpacing: '.1em',
                  }}
                >
                  STEP 2 OF 5
                </span>
                <h2
                  style={{
                    fontFamily: disp,
                    fontSize: 24,
                    fontWeight: 800,
                    marginTop: 4,
                  }}
                >
                  NER Entities + Wiki Concepts → Enriched Query
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                <GlowCard active={false}>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      color: C.amb,
                      marginBottom: 10,
                      letterSpacing: '.08em',
                    }}
                  >
                    NER ENTITIES (spaCy) → d_ent
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {q.ner.map((e, i) => (
                      <Tag
                        key={e}
                        color={C.amb}
                        bg={C.ambBg}
                        delay={300 + i * 200}
                      >
                        {e}
                      </Tag>
                    ))}
                  </div>
                </GlowCard>
                <GlowCard active={false}>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      color: C.acc,
                      marginBottom: 10,
                      letterSpacing: '.08em',
                    }}
                  >
                    WIKI CONCEPTS (Wikifier) → q_wiki + d_wiki
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {q.wQD.map((w, i) => (
                      <Tag
                        key={w.t}
                        color={C.accBright}
                        bg={C.accBg}
                        delay={600 + i * 250}
                      >
                        W:{w.t}
                      </Tag>
                    ))}
                  </div>
                </GlowCard>
              </div>

              {/* Model equations */}
              <GlowCard active style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: C.dim,
                    marginBottom: 12,
                    letterSpacing: '.08em',
                  }}
                >
                  MODEL FORMULATIONS (PyTerrier)
                </div>
                {[
                  {
                    n: 'Baseline',
                    eq: 'f( q_txt, s_txt )',
                    c: C.dim,
                    delay: 200,
                  },
                  {
                    n: 'DCU',
                    eq: 'f( q_txt + d_ent, s_txt )',
                    c: C.amb,
                    delay: 500,
                  },
                  {
                    n: 'Wiki_rel',
                    eq: 'f( q_txt + q_wiki + d_wiki, s_txt + s_wiki )',
                    c: C.acc,
                    delay: 800,
                  },
                  {
                    n: 'Ent_Wiki_rel ★',
                    eq: 'f( q_txt + d_ent + q_wiki + d_wiki, s_txt + s_wiki )',
                    c: C.grn,
                    delay: 1100,
                  },
                ].map((m) => (
                  <div
                    key={m.n}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      marginBottom: 4,
                      borderRadius: 8,
                      background: m.n.includes('★') ? C.accBg : 'transparent',
                      borderLeft: `3px solid ${m.c}`,
                      opacity: 0,
                      animation: `slideR .4s ease ${m.delay}ms forwards`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 12,
                        color: m.c,
                        fontWeight: m.n.includes('★') ? 700 : 400,
                      }}
                    >
                      {m.n}
                    </span>
                    <code
                      style={{ fontFamily: mono, fontSize: 11, color: C.soft }}
                    >
                      {m.eq}
                    </code>
                  </div>
                ))}
              </GlowCard>

              {/* Enriched query visual */}
              <GlowCard
                active
                glow={C.grnGlow}
                border={C.grn}
                style={{ animation: 'fadeUp .5s ease 1.4s both' }}
              >
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: C.grn,
                    marginBottom: 8,
                  }}
                >
                  FINAL ENRICHED QUERY (Ent_Wiki_rel)
                </div>
                <div
                  style={{ fontFamily: mono, fontSize: 12, lineHeight: 2.4 }}
                >
                  <Tag color={C.ink} bg={C.s3} delay={1500}>
                    {q.q}
                  </Tag>
                  {q.ner.map((e, i) => (
                    <Tag
                      key={e}
                      color={C.amb}
                      bg={C.ambBg}
                      delay={1700 + i * 150}
                    >
                      {e}
                    </Tag>
                  ))}
                  {q.wQD.map((w, i) => (
                    <Tag
                      key={w.t}
                      color={C.accBright}
                      bg={C.accBg}
                      delay={2000 + i * 200}
                    >
                      W:{w.t.replace(/ /g, '_')}
                    </Tag>
                  ))}
                </div>
              </GlowCard>

              <div
                style={{
                  marginTop: 18,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <button
                  onClick={prev}
                  style={{
                    fontSize: 12,
                    color: C.soft,
                    background: C.s2,
                    border: `1px solid ${C.brd}`,
                    borderRadius: 8,
                    padding: '10px 20px',
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={next}
                  style={{
                    fontSize: 12,
                    color: '#fff',
                    background: C.acc,
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 24px',
                    fontWeight: 600,
                  }}
                >
                  Next: Index →
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 3: INDEX ═══ */}
          {step === 3 && q && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: C.acc,
                    letterSpacing: '.1em',
                  }}
                >
                  STEP 3 OF 5
                </span>
                <h2
                  style={{
                    fontFamily: disp,
                    fontSize: 24,
                    fontWeight: 800,
                    marginTop: 4,
                  }}
                >
                  PyTerrier Multi-Field Index
                </h2>
                <p style={{ color: C.soft, fontSize: 14, marginTop: 6 }}>
                  Each 2-min segment has{' '}
                  <code style={{ fontFamily: mono, color: C.soft }}>text</code>{' '}
                  (raw ASR) +{' '}
                  <code style={{ fontFamily: mono, color: C.accBright }}>
                    wiki
                  </code>{' '}
                  (Wikifier concepts). DPH scores across both.
                </p>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {q.segs.map((seg, i) => (
                  <GlowCard
                    key={i}
                    active={false}
                    style={{ animation: `slideR .4s ease ${i * 150}ms both` }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>
                          {seg.title}
                        </span>
                        <code
                          style={{
                            fontFamily: mono,
                            fontSize: 9,
                            color: C.dim,
                            marginLeft: 8,
                          }}
                        >
                          {seg.d}
                        </code>
                      </div>
                      <Dots n={seg.r} />
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: 9,
                          color: C.soft,
                          background: C.s3,
                          padding: '2px 6px',
                          borderRadius: 3,
                          marginRight: 8,
                        }}
                      >
                        text
                      </span>
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: 11,
                          color: C.soft,
                        }}
                      >
                        {seg.txt}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: 9,
                          color: C.accBright,
                          background: C.accBg,
                          padding: '2px 6px',
                          borderRadius: 3,
                          marginRight: 8,
                        }}
                      >
                        wiki
                      </span>
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: 11,
                          color: C.accBright,
                        }}
                      >
                        {seg.wiki}
                      </span>
                    </div>
                  </GlowCard>
                ))}
              </div>
              <div
                style={{
                  marginTop: 18,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <button
                  onClick={prev}
                  style={{
                    fontSize: 12,
                    color: C.soft,
                    background: C.s2,
                    border: `1px solid ${C.brd}`,
                    borderRadius: 8,
                    padding: '10px 20px',
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={next}
                  style={{
                    fontSize: 12,
                    color: '#fff',
                    background: C.acc,
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 24px',
                    fontWeight: 600,
                  }}
                >
                  Next: Retrieve →
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 4: RETRIEVE ═══ */}
          {step === 4 && q && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: C.acc,
                    letterSpacing: '.1em',
                  }}
                >
                  STEP 4 OF 5
                </span>
                <h2
                  style={{
                    fontFamily: disp,
                    fontSize: 24,
                    fontWeight: 800,
                    marginTop: 4,
                  }}
                >
                  DPH Retrieval + Relevance Signal
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                <GlowCard active style={{ animation: 'slideR .4s ease' }}>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      color: C.grn,
                      marginBottom: 10,
                    }}
                  >
                    JACCARD WIKI OVERLAP (RQ1)
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        background: C.grnBg,
                        borderRadius: 8,
                        padding: 14,
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{ fontFamily: mono, fontSize: 9, color: C.grn }}
                      >
                        RELEVANT
                      </div>
                      <div
                        style={{
                          fontFamily: disp,
                          fontSize: 32,
                          fontWeight: 800,
                          color: C.grn,
                          animation: 'countUp .6s ease .3s both',
                        }}
                      >
                        {q.jR}
                      </div>
                    </div>
                    <div
                      style={{
                        background: C.redBg,
                        borderRadius: 8,
                        padding: 14,
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{ fontFamily: mono, fontSize: 9, color: C.red }}
                      >
                        NON-REL
                      </div>
                      <div
                        style={{
                          fontFamily: disp,
                          fontSize: 32,
                          fontWeight: 800,
                          color: C.red,
                          animation: 'countUp .6s ease .5s both',
                        }}
                      >
                        {q.jNR}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 11,
                      color: C.grn,
                      textAlign: 'center',
                    }}
                  >
                    Mann-Whitney: p = {q.pV}
                  </div>
                </GlowCard>

                <GlowCard
                  active={false}
                  style={{ animation: 'slideL .4s ease .2s both' }}
                >
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      color: C.dim,
                      marginBottom: 10,
                    }}
                  >
                    RANKED RESULTS
                  </div>
                  {q.segs.map((seg, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '8px 0',
                        borderBottom:
                          i < q.segs.length - 1 ? `1px solid ${C.s3}` : 'none',
                        animation: `fadeUp .35s ease ${400 + i * 200}ms both`,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 3,
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: 13 }}>
                          #{i + 1} {seg.title}
                        </span>
                        <Dots n={seg.r} />
                      </div>
                      <div
                        style={{
                          fontFamily: mono,
                          fontSize: 11,
                          color: C.dim,
                          fontStyle: 'italic',
                        }}
                      >
                        {seg.txt.slice(0, 70)}...
                      </div>
                    </div>
                  ))}
                </GlowCard>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={prev}
                  style={{
                    fontSize: 12,
                    color: C.soft,
                    background: C.s2,
                    border: `1px solid ${C.brd}`,
                    borderRadius: 8,
                    padding: '10px 20px',
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={next}
                  style={{
                    fontSize: 12,
                    color: '#fff',
                    background: C.acc,
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 24px',
                    fontWeight: 600,
                  }}
                >
                  Next: Evaluation →
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 5: EVAL ═══ */}
          {step === 5 && q && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: C.acc,
                    letterSpacing: '.1em',
                  }}
                >
                  STEP 5 OF 5
                </span>
                <h2
                  style={{
                    fontFamily: disp,
                    fontSize: 24,
                    fontWeight: 800,
                    marginTop: 4,
                  }}
                >
                  trec_eval · All Models (Table 2)
                </h2>
              </div>

              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {[
                  ['P10', 'P@10'],
                  ['NDCG', 'NDCG'],
                  ['N30', 'NDCG@30'],
                ].map(([k, l]) => (
                  <button
                    key={k}
                    onClick={() => setMet(k)}
                    style={{
                      fontSize: 11,
                      padding: '5px 14px',
                      borderRadius: 6,
                      background: met === k ? C.accBg : C.s2,
                      border: `1px solid ${met === k ? C.acc : C.brd}`,
                      color: met === k ? C.acc : C.soft,
                      fontWeight: met === k ? 600 : 400,
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <GlowCard active={false} style={{ marginBottom: 18 }}>
                {TABLE2.map((row, i) => {
                  const val = row[met];
                  const best = val === Math.max(...TABLE2.map((r) => r[met]));
                  return (
                    <div
                      key={row.m}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 0',
                        borderBottom:
                          i < TABLE2.length - 1 ? `1px solid ${C.s2}` : 'none',
                        animation: `slideR .4s ease ${i * 100}ms both`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: 12,
                          width: 95,
                          color: best ? C.acc : C.soft,
                          fontWeight: best ? 700 : 400,
                        }}
                      >
                        {row.m}
                      </span>
                      <div style={{ display: 'flex', gap: 3, width: 120 }}>
                        {Object.entries(row.f).map(([k, v]) => (
                          <span
                            key={k}
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: 3,
                              fontSize: 7,
                              fontFamily: mono,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: v
                                ? k.includes('w')
                                  ? C.accBg
                                  : k === 'de'
                                  ? C.ambBg
                                  : C.s3
                                : C.s2,
                              color: v
                                ? k.includes('w')
                                  ? C.acc
                                  : k === 'de'
                                  ? C.amb
                                  : C.dim
                                : C.s3,
                              border: `1px solid ${v ? C.brd : 'transparent'}`,
                            }}
                          >
                            {v ? '✓' : ''}
                          </span>
                        ))}
                      </div>
                      <AnimBar
                        value={val}
                        color={
                          best
                            ? C.acc
                            : row.t === 'proposed'
                            ? C.accBright
                            : C.s3
                        }
                        delay={200 + i * 120}
                      />
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: 13,
                          width: 36,
                          textAlign: 'right',
                          color: best ? C.acc : C.ink,
                          fontWeight: best ? 700 : 400,
                        }}
                      >
                        {val.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </GlowCard>

              {/* IMPACT */}
              <div
                style={{
                  background: `linear-gradient(135deg,${C.acc},#1d4ed8)`,
                  borderRadius: 14,
                  padding: '28px 26px',
                  color: '#fff',
                  animation: 'fadeUp .5s ease .3s both',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  {[
                    { v: '+20%', s: 'P@10 improvement' },
                    { v: '0.36', s: 'Best Precision@10' },
                    { v: 'p<.01', s: 'All queries significant' },
                  ].map((x, i) => (
                    <div
                      key={x.v}
                      style={{
                        textAlign: 'center',
                        animation: `countUp .5s ease ${600 + i * 200}ms both`,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: disp,
                          fontSize: 32,
                          fontWeight: 800,
                        }}
                      >
                        {x.v}
                      </div>
                      <div
                        style={{ fontFamily: mono, fontSize: 10, opacity: 0.7 }}
                      >
                        {x.s}
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.65, opacity: 0.9 }}>
                  Wikipedia concepts disambiguate noisy queries and improve
                  early precision — using lightweight probabilistic models
                  (DPH), no GPU, no neural re-ranking. Directly applicable to
                  any domain with noisy text: medical records, legal
                  transcriptions, voice interfaces.
                </p>
              </div>

              <div style={{ marginTop: 18, textAlign: 'left' }}>
                <button
                  onClick={prev}
                  style={{
                    fontSize: 12,
                    color: C.soft,
                    background: C.s2,
                    border: `1px solid ${C.brd}`,
                    borderRadius: 8,
                    padding: '10px 20px',
                  }}
                >
                  ← Back
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
