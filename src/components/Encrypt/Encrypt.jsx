import { useState, useEffect, useCallback } from "react";
import { FaUnlock } from "react-icons/fa";
import { MdFlashAuto } from "react-icons/md";


const CIPHERS = ["Caesar Cipher", "Vigenère", "XOR", "Base64"];

function caesarCipher(text, key) {
    const shift = ((parseInt(key) || 3) % 26 + 26) % 26;
    return text.replace(/[a-zA-Z]/g, (c) => {
        const base = c >= "a" ? 97 : 65;
        return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
    });
}

function vigenereCipher(text, key) {
    const k = (key || "KEY").toUpperCase().replace(/[^A-Z]/g, "") || "KEY";
    let ki = 0;
    return text.replace(/[a-zA-Z]/g, (c) => {
        const base = c >= "a" ? 97 : 65;
        const shift = k.charCodeAt(ki++ % k.length) - 65;
        return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
    });
}

function xorCipher(text, key) {
    const keyNum = parseInt(key) || 42;
    return text.split("").map((c) => String.fromCharCode(c.charCodeAt(0) ^ keyNum)).join("");
}

function base64Encode(text) {
    try { return btoa(unescape(encodeURIComponent(text))); } catch { return ""; }
}

function processText(cipher, text, key) {
    if (!text) return "";
    switch (cipher) {
        case "Caesar Cipher": return caesarCipher(text, key);
        case "Vigenère": return vigenereCipher(text, key);
        case "XOR": return xorCipher(text, key);
        case "Base64": return base64Encode(text);
        default: return text;
    }
}

function generateKey(cipher) {
    if (cipher === "Caesar Cipher") return String(Math.floor(Math.random() * 25) + 1);
    if (cipher === "Vigenère") {
        const len = Math.floor(Math.random() * 5) + 4;
        return Array.from({ length: len }, () =>
            String.fromCharCode(65 + Math.floor(Math.random() * 26))
        ).join("");
    }
    if (cipher === "XOR") return String(Math.floor(Math.random() * 254) + 1);
    return "";
}

function wordCount(text) {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export default function Encrypt() {
    const [cipher, setCipher] = useState("Caesar Cipher");
    const [dropdownOpen, setDropdown] = useState(false);
    const [sourceText, setSourceText] = useState("");
    const [encKey, setEncKey] = useState("");
    const [output, setOutput] = useState("");
    const [liveMode, setLiveMode] = useState(true);
    const [copied, setCopied] = useState(false);

    const words = wordCount(sourceText);
    const isBase64 = cipher === "Base64";

    const run = useCallback(() => {
        setOutput(processText(cipher, sourceText, encKey));
    }, [cipher, sourceText, encKey]);

    useEffect(() => {
        setEncKey("");
        setOutput("");
    }, [cipher]);

    function handleTextChange(e) {
        const val = e.target.value;
        if (wordCount(val) > 50) return;
        setSourceText(val);
        if (liveMode) setOutput(processText(cipher, val, encKey));
    }

    function handleKeyChange(e) {
        setEncKey(e.target.value);
        if (liveMode) setOutput(processText(cipher, sourceText, e.target.value));
    }

    function handleAutoKey() {
        const k = generateKey(cipher);
        setEncKey(k);
        if (liveMode) setOutput(processText(cipher, sourceText, k));
    }

    function handleCopy() {
        if (!output) return;
        navigator.clipboard.writeText(output).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        });
    }

    function handleExport() {
        if (!output) return;
        const blob = new Blob([output], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `encrypted_${cipher.replace(/\s+/g, "_").toLowerCase()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function handleCipherSelect(c) {
        setCipher(c);
        setDropdown(false);
    }

    function toggleLive() {
        const next = !liveMode;
        setLiveMode(next);
        if (next) setOutput(processText(cipher, sourceText, encKey));
    }

    const keyPlaceholder =
        cipher === "Caesar Cipher" ? "Shift number (e.g. 3)…" :
            cipher === "Vigenère" ? "Keyword (e.g. SECRET)…" :
                cipher === "XOR" ? "Number (e.g. 42)…" :
                    "No key needed for Base64";

    return (
        <div className="w-15/16 md:w-2/3 lg:w-1/2 rounded-lg bg-gray-950 flex items-center justify-center p-3 md:p-6">
            <div className="w-full bg-gray-900 rounded-xl border border-gray-800 p-3 md:p-6 space-y-2">

                {/* Protocol Selection */}
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Protocol Selection</p>
                    <div className="flex items-center justify-between gap-4">

                        <div className="relative w-56">
                            <button
                                onClick={() => setDropdown((o) => !o)}
                                className="w-full flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 hover:border-gray-600 transition-colors"
                            >
                                <span className="text-gray-400 text-sm"><FaUnlock></FaUnlock></span>
                                <span className="text-white text-sm flex-1 text-left">{cipher}</span>
                                <span className="text-gray-400 text-xs">{dropdownOpen ? "▲" : "▼"}</span>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl">
                                    {CIPHERS.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => handleCipherSelect(c)}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${c === cipher
                                                    ? "bg-emerald-500/20 text-emerald-400"
                                                    : "text-gray-300 hover:bg-gray-700"
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 flex-nowrap">
                            <span className="text-xs text-gray-500 uppercase tracking-widest">Live Mode</span>
                            <button
                                onClick={toggleLive}
                                className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${liveMode ? "bg-emerald-500" : "bg-gray-700"}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${liveMode ? "left-5" : "left-0.5"}`} />
                            </button>
                            <div className={`w-2.5 h-2.5 rounded-full transition-colors shrink-0 ${liveMode ? "bg-sky-400" : "bg-gray-600"}`} />
                        </div>
                    </div>
                </div>

                {/* Source Buffer */}
                <div>
                    <div className="flex justify-between mb-2">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Source Buffer</p>
                        <p className={`text-xs ${words >= 50 ? "text-red-400" : "text-gray-600"}`}>
                            {words} / 50 words
                        </p>
                    </div>
                    <textarea
                        value={sourceText}
                        onChange={handleTextChange}
                        className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="Enter your text here..."
                    />
                </div>

                {/* Encryption Key */}
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Encryption Key</p>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 focus-within:border-emerald-500 transition-colors">
                            <span className="text-gray-500 text-sm">🗝️</span>
                            <input
                                value={encKey}
                                onChange={handleKeyChange}
                                disabled={isBase64}
                                className="bg-transparent text-sm text-gray-300 placeholder-gray-600 flex-1 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                                placeholder={keyPlaceholder}
                            />
                        </div>
                        <button
                            onClick={handleAutoKey}
                            disabled={isBase64}
                            title="Auto-generate key"
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3.5 text-gray-400 hover:text-emerald-400 hover:border-emerald-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-base"
                        >
                            <MdFlashAuto />
                        </button>
                    </div>
                    {isBase64 && (
                        <p className="text-xs text-gray-600 mt-1.5">Base64 is an encoding scheme — no key required.</p>
                    )}
                </div>

                {/* Processed Output */}
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Processed Output</p>
                    <div className="relative bg-gray-950 border border-gray-800 rounded-lg min-h-28 p-3 pr-20">
                        {output
                            ? <p className="text-sm text-emerald-400 font-mono break-all whitespace-pre-wrap">{output}</p>
                            : <p className="text-sm text-gray-700">Output will appear here…</p>
                        }
                        <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                        >
                            {copied ? "✓ Copied" : "⧉ Copy"}
                        </button>
                    </div>
                </div>

                {/* Generate Button — hidden in live mode */}
                {!liveMode && (
                    <button
                        onClick={run}
                        className="w-full bg-emerald-400 hover:bg-emerald-300 text-gray-950 font-bold tracking-widest uppercase text-sm py-3.5 rounded-lg transition-colors"
                    >
                        Generate Cipher
                    </button>
                )}

                {/* Export */}
                <div className="flex justify-end">
                    <button
                        onClick={handleExport}
                        disabled={!output}
                        className="flex items-center gap-2 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-gray-950 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        ↓ Export .txt
                    </button>
                </div>

            </div>
        </div>
    );
}