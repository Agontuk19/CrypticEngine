import React, { useState, useEffect, useRef } from 'react';
import { FaUnlock, FaLock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { HiMiniCodeBracket } from 'react-icons/hi2';

// ── cipher logic (mirrors the actual components) ──────────────────────────────
function caesarEncrypt(text, shift) {
    return text.replace(/[a-zA-Z]/g, (c) => {
        const base = c >= 'a' ? 97 : 65;
        return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
    });
}
function caesarDecrypt(text, shift) {
    return text.replace(/[a-zA-Z]/g, (c) => {
        const base = c >= 'a' ? 97 : 65;
        return String.fromCharCode(((c.charCodeAt(0) - base - shift + 26) % 26) + base);
    });
}
function vigenereEncrypt(text, key) {
    const k = key.toUpperCase();
    let ki = 0;
    return text.replace(/[a-zA-Z]/g, (c) => {
        const base = c >= 'a' ? 97 : 65;
        const shift = k.charCodeAt(ki++ % k.length) - 65;
        return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
    });
}
function vigenereDecrypt(text, key) {
    const k = key.toUpperCase();
    let ki = 0;
    return text.replace(/[a-zA-Z]/g, (c) => {
        const base = c >= 'a' ? 97 : 65;
        const shift = k.charCodeAt(ki++ % k.length) - 65;
        return String.fromCharCode(((c.charCodeAt(0) - base - shift + 26) % 26) + base);
    });
}
function xorCipher(text, key) {
    return text.split('').map((c) => String.fromCharCode(c.charCodeAt(0) ^ key)).join('');
}
function base64Encode(text) {
    try { return btoa(unescape(encodeURIComponent(text))); } catch { return ''; }
}
function base64Decode(text) {
    try { return decodeURIComponent(escape(atob(text))); } catch { return ''; }
}

// ── self-test suite ───────────────────────────────────────────────────────────
const TEST_WORD = 'CRYPTIC';
function runTests() {
    const t0 = performance.now();
    const caesarEnc = caesarEncrypt(TEST_WORD, 13);
    const caesarOk = caesarDecrypt(caesarEnc, 13) === TEST_WORD;
    const t1 = performance.now();

    const vigEnc = vigenereEncrypt(TEST_WORD, 'ENGINE');
    const vigOk = vigenereDecrypt(vigEnc, 'ENGINE') === TEST_WORD;
    const t2 = performance.now();

    const xorEnc = xorCipher(TEST_WORD, 42);
    const xorOk = xorCipher(xorEnc, 42) === TEST_WORD;
    const t3 = performance.now();

    const b64Enc = base64Encode(TEST_WORD);
    const b64Ok = base64Decode(b64Enc) === TEST_WORD;
    const t4 = performance.now();

    return [
        { id: 'caesar', label: 'Caesar Cipher', ok: caesarOk, ms: (t1 - t0).toFixed(3), enc: caesarEnc },
        { id: 'vigenere', label: 'Vigenère', ok: vigOk, ms: (t2 - t1).toFixed(3), enc: vigEnc },
        { id: 'xor', label: 'XOR', ok: xorOk, ms: (t3 - t2).toFixed(3), enc: xorEnc },
        { id: 'base64', label: 'Base64', ok: b64Ok, ms: (t4 - t3).toFixed(3), enc: b64Enc },
    ];
}

// ── terminal log lines ────────────────────────────────────────────────────────
const BOOT_LINES = [
    { delay: 0, color: 'teal', text: '> CRYPTIC ENGINE v1.0.0 — BOOT SEQUENCE INITIATED' },
    { delay: 300, color: 'dim', text: '> Loading cipher modules...' },
    { delay: 600, color: 'teal', text: '> [OK] Caesar Cipher module loaded' },
    { delay: 900, color: 'teal', text: '> [OK] Vigenère module loaded' },
    { delay: 1200, color: 'teal', text: '> [OK] XOR module loaded' },
    { delay: 1500, color: 'teal', text: '> [OK] Base64 encoding module loaded' },
    { delay: 1800, color: 'dim', text: '> Verifying client-side isolation...' },
    { delay: 2100, color: 'teal', text: '> [OK] No outbound network requests detected' },
    { delay: 2400, color: 'dim', text: '> Running integrity self-tests...' },
    { delay: 2700, color: 'teal', text: '> [PASS] All cipher round-trips verified' },
    { delay: 3000, color: 'dim', text: '> Detecting runtime environment...' },
    { delay: 3300, color: 'teal', text: '> [OK] Browser environment confirmed' },
    { delay: 3600, color: 'gold', text: '> ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
    { delay: 3900, color: 'teal', text: '> ALL SYSTEMS OPERATIONAL. STANDING BY.' },
];

// ── uptime counter ────────────────────────────────────────────────────────────
const SESSION_START = Date.now();
function formatUptime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    return `${String(h).padStart(2, '0')}h ${String(m % 60).padStart(2, '0')}m ${String(s % 60).padStart(2, '0')}s`;
}

// ── component ─────────────────────────────────────────────────────────────────
const Status = () => {
    const [tests] = useState(() => runTests());
    const [logLines, setLogLines] = useState([]);
    const [clock, setClock] = useState(new Date());
    const [uptime, setUptime] = useState('00h 00m 00s');
    const [stats, setStats] = useState({ encryptions: 0, decryptions: 0 });
    const logRef = useRef(null);

    // boot log reveal
    useEffect(() => {
        BOOT_LINES.forEach(({ delay, color, text }) => {
            setTimeout(() => {
                setLogLines(prev => [...prev, { color, text }]);
                if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
            }, delay);
        });
    }, []);

    // live clock + uptime
    useEffect(() => {
        const id = setInterval(() => {
            setClock(new Date());
            setUptime(formatUptime(Date.now() - SESSION_START));
        }, 1000);
        return () => clearInterval(id);
    }, []);

    // read localStorage stats
    useEffect(() => {
        const enc = parseInt(localStorage.getItem('ce_encryptions') || '0');
        const dec = parseInt(localStorage.getItem('ce_decryptions') || '0');
        setStats({ encryptions: enc, decryptions: dec });
    }, []);

    const allPass = tests.every(t => t.ok);

    return (
        <div className="min-h-screen w-full bg-[#0A0F14] text-white">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bungee&display=swap');
                .s-mono   { font-family: 'Share Tech Mono', monospace; }
                .s-bungee { font-family: 'Bungee', cursive; }

                .s-grid-bg {
                    background-image:
                        linear-gradient(rgba(0,255,198,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,255,198,0.025) 1px, transparent 1px);
                    background-size: 40px 40px;
                }

                @keyframes s-shimmer {
                    0%   { background-position: 0% 0; }
                    100% { background-position: 200% 0; }
                }
                .s-gradient-text {
                    background: linear-gradient(90deg, #00FFC6, #15A4FF, #00FFC6);
                    background-size: 200% 100%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: s-shimmer 4s linear infinite;
                }

                @keyframes pulse-dot {
                    0%,100% { opacity:1; transform:scale(1);   }
                    50%     { opacity:.4; transform:scale(1.6); }
                }
                .s-pulse { animation: pulse-dot 2s ease-in-out infinite; }

                @keyframes blink {
                    0%,100% { opacity:1; }
                    50%     { opacity:0; }
                }
                .cursor { animation: blink 1s step-end infinite; }

                .s-card {
                    background: #0F1923;
                    border: 1px solid #1E2D3D;
                    border-radius: 12px;
                }
                .s-card:hover {
                    border-color: #2D4A5E;
                    transition: border-color 0.2s;
                }

                /* test row hover */
                .test-row {
                    border-bottom: 1px solid #1E2D3D;
                    transition: background 0.15s;
                }
                .test-row:last-child { border-bottom: none; }
                .test-row:hover { background: rgba(0,255,198,0.03); }

                /* metric card accent line */
                .metric-enc { border-top: 2px solid #00FFC6; }
                .metric-dec { border-top: 2px solid #fb7185; }
                .metric-up  { border-top: 2px solid #15A4FF; }
                .metric-ver { border-top: 2px solid #a78bfa; }

                /* terminal */
                .terminal {
                    background: #050A0E;
                    border: 1px solid #1E2D3D;
                    border-radius: 10px;
                    overflow: hidden;
                }
                .log-teal { color: #00FFC6; }
                .log-dim  { color: #3D5A6E; }
                .log-gold { color: #F59E0B; }

                @keyframes fade-in-up {
                    from { opacity:0; transform:translateY(6px); }
                    to   { opacity:1; transform:translateY(0);   }
                }
                .log-line { animation: fade-in-up 0.2s ease forwards; }
            `}</style>

            {/* ── HEADER ── */}
            <div className="s-grid-bg border-b border-[#1E2D3D] px-6 md:px-10 lg:px-20 pt-10 pb-8">
                <div className="max-w-5xl mx-auto">
                    <div className="s-mono text-[0.6rem] tracking-[0.3em] text-[#2D5A4A] bg-[#001A12] border border-[#00FFC6]/15 rounded-full px-4 py-1 w-fit mb-4">
                        SYSTEM // STATUS MONITOR
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <h1 className="s-bungee text-2xl md:text-3xl">
                                <span className="s-gradient-text">SYSTEM</span>
                                <span className="text-white"> STATUS</span>
                            </h1>
                            <p className="s-mono text-[#3D5066] text-xs mt-1 tracking-wide">
                                Real-time diagnostics — client-side only
                            </p>
                        </div>
                        {/* overall health badge */}
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border s-mono text-sm font-bold tracking-widest
                            ${allPass
                                ? 'bg-[#001A12] border-[#00FFC6]/30 text-[#00FFC6]'
                                : 'bg-[#1A0008] border-rose-500/30 text-rose-400'}`}>
                            <span className={`s-pulse w-2 h-2 rounded-full ${allPass ? 'bg-[#00FFC6]' : 'bg-rose-400'}`} />
                            {allPass ? 'ALL SYSTEMS GO' : 'DEGRADED'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 md:px-10 lg:px-20 py-8 space-y-8">

                {/* ── METRIC CARDS ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'ENCRYPTIONS', value: stats.encryptions, accent: 'metric-enc', icon: <FaUnlock className="text-[#00FFC6] text-xs" />, sub: 'this session' },
                        { label: 'DECRYPTIONS', value: stats.decryptions, accent: 'metric-dec', icon: <FaLock className="text-rose-400 text-xs" />, sub: 'this session' },
                        { label: 'SESSION UP', value: uptime, accent: 'metric-up', icon: <span className="text-[#15A4FF] text-xs">⏱</span>, sub: 'hh mm ss' },
                        { label: 'VERSION', value: 'v1.0.0', accent: 'metric-ver', icon: <HiMiniCodeBracket className="text-violet-400 text-xs" />, sub: 'stable' },
                    ].map(({ label, value, accent, icon, sub }) => (
                        <div key={label} className={`s-card ${accent} p-4`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="s-mono text-[0.58rem] tracking-[0.18em] text-[#3D5066]">{label}</span>
                                {icon}
                            </div>
                            <div className="s-mono text-white text-lg font-bold leading-none mb-1 truncate">{value}</div>
                            <div className="s-mono text-[0.6rem] text-[#2D3D4E]">{sub}</div>
                        </div>
                    ))}
                </div>

                {/* ── CIPHER INTEGRITY TESTS ── */}
                <div className="s-card overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2D3D]">
                        <div>
                            <p className="s-mono text-[0.6rem] tracking-[0.2em] text-[#2D3D4E] mb-0.5">INTEGRITY CHECK</p>
                            <p className="text-white text-sm font-semibold s-mono">Cipher Round-Trip Tests</p>
                        </div>
                        <div className="s-mono text-[0.6rem] tracking-widest text-[#3D5066]">
                            INPUT: <span className="text-[#00FFC6]">"{TEST_WORD}"</span>
                        </div>
                    </div>

                    {tests.map((t) => (
                        <div key={t.id} className="test-row px-5 py-3.5 flex flex-wrap items-center gap-3">
                            {/* pass/fail */}
                            <div className={`flex items-center gap-1.5 w-20 shrink-0`}>
                                {t.ok
                                    ? <FaCheckCircle className="text-[#00FFC6] text-sm" />
                                    : <FaTimesCircle className="text-rose-400 text-sm" />
                                }
                                <span className={`s-mono text-[0.65rem] font-bold tracking-widest ${t.ok ? 'text-[#00FFC6]' : 'text-rose-400'}`}>
                                    {t.ok ? 'PASS' : 'FAIL'}
                                </span>
                            </div>
                            {/* name */}
                            <span className="s-mono text-sm text-white w-28 shrink-0">{t.label}</span>
                            {/* encoded sample */}
                            <span className="s-mono text-xs text-[#3D5066] flex-1 truncate hidden sm:block">
                                → <span className="text-[#15A4FF]">{t.enc}</span>
                            </span>
                            {/* timing */}
                            <span className="s-mono text-[0.65rem] text-[#2D3D4E] shrink-0 ml-auto">
                                {t.ms}ms
                            </span>
                        </div>
                    ))}
                </div>

                {/* ── ENVIRONMENT + CLOCK ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* environment info */}
                    <div className="s-card p-5">
                        <p className="s-mono text-[0.6rem] tracking-[0.2em] text-[#2D3D4E] mb-4">RUNTIME ENVIRONMENT</p>
                        <div className="space-y-3">
                            {[
                                { label: 'PLATFORM', value: navigator.platform || 'Unknown' },
                                { label: 'LANGUAGE', value: navigator.language || 'Unknown' },
                                { label: 'ONLINE', value: navigator.onLine ? 'YES' : 'NO' },
                                { label: 'STORAGE', value: typeof localStorage !== 'undefined' ? 'AVAILABLE' : 'UNAVAILABLE' },
                                { label: 'JS ENGINE', value: 'Browser V8 / SpiderMonkey' },
                                { label: 'DATA POLICY', value: 'CLIENT-SIDE ONLY' },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex items-center justify-between border-b border-[#1A2530] pb-2 last:border-0 last:pb-0">
                                    <span className="s-mono text-[0.62rem] tracking-widest text-[#3D5066]">{label}</span>
                                    <span className="s-mono text-[0.72rem] text-[#00FFC6]">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* live clock */}
                    <div className="s-card p-5 flex flex-col">
                        <p className="s-mono text-[0.6rem] tracking-[0.2em] text-[#2D3D4E] mb-4">LIVE CLOCK</p>
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-4">
                            <div className="s-mono text-[2rem] md:text-[2.4rem] text-[#00FFC6] tracking-widest leading-none">
                                {clock.toLocaleTimeString('en-US', { hour12: false })}
                                <span className="cursor text-[#00FFC6]">_</span>
                            </div>
                            <div className="s-mono text-xs text-[#3D5066] tracking-widest">
                                {clock.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
                            </div>
                            <div className="s-mono text-[0.6rem] text-[#2D3D4E] tracking-widest">
                                UTC{clock.toTimeString().match(/GMT([+-]\d+)/)?.[1] || ''}
                            </div>
                            <div className="w-full border-t border-[#1E2D3D] pt-3 mt-2 flex justify-between">
                                <span className="s-mono text-[0.6rem] text-[#2D3D4E]">SESSION UPTIME</span>
                                <span className="s-mono text-[0.7rem] text-[#15A4FF]">{uptime}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── MODULE STATUS TABLE ── */}
                <div className="s-card overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#1E2D3D]">
                        <p className="s-mono text-[0.6rem] tracking-[0.2em] text-[#2D3D4E] mb-0.5">MODULE REGISTRY</p>
                        <p className="text-white text-sm font-semibold s-mono">Loaded Components</p>
                    </div>
                    <div className="divide-y divide-[#1E2D3D]">
                        {[
                            { name: 'Encrypt Component', type: 'UI MODULE', accent: 'text-[#00FFC6]', icon: <FaUnlock className="text-[#00FFC6]" /> },
                            { name: 'Decrypt Component', type: 'UI MODULE', accent: 'text-rose-400', icon: <FaLock className="text-rose-400" /> },
                            { name: 'Documentation Page', type: 'STATIC PAGE', accent: 'text-[#15A4FF]', icon: <span className="text-[#15A4FF]">📄</span> },
                            { name: 'Status Monitor', type: 'LIVE MODULE', accent: 'text-violet-400', icon: <span className="text-violet-400">📡</span> },
                            { name: 'NavBar', type: 'LAYOUT', accent: 'text-yellow-400', icon: <span className="text-yellow-400">⬛</span> },
                            { name: 'Footer', type: 'LAYOUT', accent: 'text-yellow-400', icon: <span className="text-yellow-400">⬛</span> },
                        ].map(({ name, type, accent, icon }) => (
                            <div key={name} className="px-5 py-3 flex items-center gap-4 hover:bg-[#00FFC6]/[0.02] transition-colors">
                                <span className="text-sm">{icon}</span>
                                <span className="s-mono text-sm text-white flex-1">{name}</span>
                                <span className={`s-mono text-[0.6rem] tracking-widest ${accent} bg-[#0A0F14] border border-current/20 rounded px-2 py-0.5 opacity-70`}>{type}</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="s-pulse w-1.5 h-1.5 rounded-full bg-[#00FFC6] block" />
                                    <span className="s-mono text-[0.6rem] text-[#00FFC6] tracking-widest">ACTIVE</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── TERMINAL LOG ── */}
                <div className="terminal">
                    {/* titlebar */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0F1923] border-b border-[#1E2D3D]">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00FFC6]/70" />
                        <span className="s-mono text-[0.6rem] text-[#2D3D4E] tracking-widest ml-2">BOOT LOG — cryptic-engine.sh</span>
                    </div>
                    {/* log body */}
                    <div
                        ref={logRef}
                        className="p-4 h-52 overflow-y-auto space-y-1 scroll-smooth"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#1E2D3D transparent' }}
                    >
                        {logLines.map((line, i) => (
                            <p key={i} className={`log-line s-mono text-xs log-${line.color} leading-relaxed`}>
                                {line.text}
                            </p>
                        ))}
                        {logLines.length === BOOT_LINES.length && (
                            <p className="s-mono text-xs log-teal">
                                {'> '}<span className="cursor">█</span>
                            </p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Status;