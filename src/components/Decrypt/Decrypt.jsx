import { useState, useEffect, useCallback } from "react";
import { FaLock } from "react-icons/fa";
import { MdFlashAuto } from "react-icons/md";

const CIPHERS = ["Caesar Cipher", "Vigenère", "XOR", "Base64"];

function caesarDecipher(text, key) {
    const shift = ((parseInt(key) || 3) % 26 + 26) % 26;
    return text.replace(/[a-zA-Z]/g, (c) => {
        const base = c >= "a" ? 97 : 65;
        return String.fromCharCode(((c.charCodeAt(0) - base - shift + 26) % 26) + base);
    });
}

function vigenereDecipher(text, key) {
    const k = (key || "KEY").toUpperCase().replace(/[^A-Z]/g, "") || "KEY";
    let ki = 0;
    return text.replace(/[a-zA-Z]/g, (c) => {
        const base = c >= "a" ? 97 : 65;
        const shift = k.charCodeAt(ki++ % k.length) - 65;
        return String.fromCharCode(((c.charCodeAt(0) - base - shift + 26) % 26) + base);
    });
}

function xorDecipher(text, key) {
    const keyNum = parseInt(key) || 42;
    return text.split("").map((c) => String.fromCharCode(c.charCodeAt(0) ^ keyNum)).join("");
}

function base64Decode(text) {
    try { return decodeURIComponent(escape(atob(text.trim()))); } catch { return "⚠ Invalid Base64 input"; }
}

function processText(cipher, text, key) {
    if (!text) return "";
    switch (cipher) {
        case "Caesar Cipher": return caesarDecipher(text, key);
        case "Vigenère": return vigenereDecipher(text, key);
        case "XOR": return xorDecipher(text, key);
        case "Base64": return base64Decode(text);
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

function charCount(text) {
    return text.length;
}

export default function Decrypt() {
    const [cipher, setCipher] = useState("Caesar Cipher");
    const [dropdownOpen, setDropdown] = useState(false);
    const [sourceText, setSourceText] = useState("");
    const [decKey, setDecKey] = useState("");
    const [output, setOutput] = useState("");
    const [liveMode, setLiveMode] = useState(true);
    const [copied, setCopied] = useState(false);

    const chars = charCount(sourceText);
    const isBase64 = cipher === "Base64";
    const CHAR_LIMIT = 500;

    const run = useCallback(() => {
        setOutput(processText(cipher, sourceText, decKey));
    }, [cipher, sourceText, decKey]);

    useEffect(() => {
        setDecKey("");
        setOutput("");
    }, [cipher]);

    function handleTextChange(e) {
        const val = e.target.value;
        if (charCount(val) > CHAR_LIMIT) return;
        setSourceText(val);
        if (liveMode) setOutput(processText(cipher, val, decKey));
    }

    function handleKeyChange(e) {
        setDecKey(e.target.value);
        if (liveMode) setOutput(processText(cipher, sourceText, e.target.value));
    }

    function handleAutoKey() {
        const k = generateKey(cipher);
        setDecKey(k);
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
        a.download = `decrypted_${cipher.replace(/\s+/g, "_").toLowerCase()}.txt`;
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
        if (next) setOutput(processText(cipher, sourceText, decKey));
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
                                <span className="text-gray-400 text-sm"><FaLock /></span>
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
                                                ? "bg-rose-500/20 text-rose-400"
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
                                className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${liveMode ? "bg-rose-500" : "bg-gray-700"}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${liveMode ? "left-5" : "left-0.5"}`} />
                            </button>
                            <div className={`w-2.5 h-2.5 rounded-full transition-colors shrink-0 ${liveMode ? "bg-sky-400" : "bg-gray-600"}`} />
                        </div>
                    </div>
                </div>

                {/* Cipher Input Buffer */}
                <div>
                    <div className="flex justify-between mb-2">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Cipher </p>
                        <p className={`text-xs ${chars >= CHAR_LIMIT ? "text-red-400" : "text-gray-600"}`}>
                            {chars} / {CHAR_LIMIT} chars
                        </p>
                    </div>
                    <textarea
                        value={sourceText}
                        onChange={handleTextChange}
                        className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-rose-500 transition-colors"
                        placeholder="Paste your encrypted text here..."
                    />
                </div>

                {/* Decryption Key */}
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Decryption Key</p>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 focus-within:border-rose-500 transition-colors">
                            <span className="text-gray-500 text-sm">🗝️</span>
                            <input
                                value={decKey}
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
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3.5 text-gray-400 hover:text-rose-400 hover:border-rose-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-base"
                        >
                            <MdFlashAuto />
                        </button>
                    </div>
                    {isBase64 && (
                        <p className="text-xs text-gray-600 mt-1.5">Base64 is an encoding scheme — no key required.</p>
                    )}
                </div>

                {/* Decrypted Output */}
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Decrypted Output</p>
                    <div className="relative bg-gray-950 border border-gray-800 rounded-lg min-h-28 p-3 pr-20">
                        {output
                            ? <p className="text-sm text-rose-400 font-mono break-all whitespace-pre-wrap">{output}</p>
                            : <p className="text-sm text-gray-700">Decrypted text will appear here…</p>
                        }
                        <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                        >
                            {copied ? "✓ Copied" : "⧉ Copy"}
                        </button>
                    </div>
                </div>

                {/* Decrypt Button — hidden in live mode */}
                {!liveMode && (
                    <button
                        onClick={run}
                        className="w-full bg-rose-400 hover:bg-rose-300 text-gray-950 font-bold tracking-widest uppercase text-sm py-3.5 rounded-lg transition-colors"
                    >
                        Decrypt Cipher
                    </button>
                )}

                {/* Export */}
                <div className="flex justify-end">
                    <button
                        onClick={handleExport}
                        disabled={!output}
                        className="flex items-center gap-2 border border-rose-500 text-rose-400 hover:bg-rose-500 hover:text-gray-950 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        ↓ Export .txt
                    </button>
                </div>

            </div>
        </div>
    );
}