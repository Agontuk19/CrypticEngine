import { useState, useEffect, useRef } from "react";
import { FaUnlock, FaLock } from "react-icons/fa";

const NAV = [
    { id: "overview", label: "Overview" },
    { id: "encryption", label: "Encryption" },
    { id: "decryption", label: "Decryption" },
    { id: "ciphers", label: "Cipher Reference" },
    { id: "caesar", label: "Caesar Cipher", indent: true },
    { id: "vigenere", label: "Vigenère", indent: true },
    { id: "xor", label: "XOR", indent: true },
    { id: "base64", label: "Base64", indent: true },
    { id: "livemode", label: "Live Mode" },
    { id: "keys", label: "Keys & Auto-Gen" },
    { id: "export", label: "Export" },
    { id: "limitations", label: "Limitations" },
];

const Tag = ({ children, color = "emerald" }) => {
    const cls = color === "emerald"
        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
        : "bg-rose-500/15 text-rose-400 border border-rose-500/30";
    return (
        <span className={`inline-block text-xs font-mono px-2 py-0.5 rounded ${cls}`}>
            {children}
        </span>
    );
};

const Badge = ({ children, color = "emerald" }) => {
    const cls = color === "emerald"
        ? "bg-emerald-500/10 text-emerald-400"
        : color === "rose"
            ? "bg-rose-500/10 text-rose-400"
            : "bg-sky-500/10 text-sky-400";
    return (
        <span className={`inline-block text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${cls}`}>
            {children}
        </span>
    );
};

const CodeBlock = ({ children, color = "emerald" }) => {
    const accent = color === "emerald" ? "text-emerald-400" : "text-rose-400";
    return (
        <pre className={`bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-xs font-mono ${accent} overflow-x-auto whitespace-pre-wrap`}>
            {children}
        </pre>
    );
};

const SectionTitle = ({ id, icon, children, color = "emerald" }) => {
    const bar = color === "emerald" ? "bg-emerald-500" : "bg-rose-500";
    return (
        <div id={id} className="flex items-center gap-3 mb-4 scroll-mt-6">
            <div className={`w-1 h-6 rounded-full ${bar}`} />
            {icon && <span className="text-gray-400 text-base">{icon}</span>}
            <h2 className="text-white text-lg font-bold tracking-tight">{children}</h2>
        </div>
    );
};

const SubTitle = ({ id, children }) => (
    <h3 id={id} className="text-gray-200 text-base font-semibold mt-6 mb-2 scroll-mt-6">
        {children}
    </h3>
);

const InfoRow = ({ label, value, valueClass = "text-gray-300" }) => (
    <div className="flex items-start gap-4 py-2 border-b border-gray-800 last:border-0">
        <span className="text-xs text-gray-500 uppercase tracking-widest w-28 shrink-0 mt-0.5">{label}</span>
        <span className={`text-sm font-mono ${valueClass}`}>{value}</span>
    </div>
);

const Callout = ({ type = "info", children }) => {
    const styles = {
        info: "border-sky-500/40 bg-sky-500/5 text-sky-300",
        warn: "border-yellow-500/40 bg-yellow-500/5 text-yellow-300",
        danger: "border-rose-500/40 bg-rose-500/5 text-rose-300",
        success: "border-emerald-500/40 bg-emerald-500/5 text-emerald-300",
    };
    const icons = { info: "ℹ", warn: "⚠", danger: "✕", success: "✓" };
    return (
        <div className={`border rounded-lg px-4 py-3 text-sm flex gap-3 items-start ${styles[type]}`}>
            <span className="mt-0.5 text-base">{icons[type]}</span>
            <div>{children}</div>
        </div>
    );
};

const CipherTable = ({ rows }) => (
    <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-sm">
            <thead>
                <tr className="bg-gray-800/60">
                    {rows[0].map((h, i) => (
                        <th key={i} className="text-left text-xs text-gray-400 uppercase tracking-widest px-4 py-2.5 font-semibold">
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.slice(1).map((row, i) => (
                    <tr key={i} className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors">
                        {row.map((cell, j) => (
                            <td key={j} className="px-4 py-2.5 text-gray-300 font-mono text-xs">
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default function Documentation() {
    const [active, setActive] = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;
        const handler = () => {
            const container = contentRef.current;
            if (!container) return;
            const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean);
            let current = sections[0]?.id || "overview";
            for (const sec of sections) {
                if (sec.offsetTop - container.offsetTop <= container.scrollTop + 100) {
                    current = sec.id;
                }
            }
            setActive(current);
        };
        el.addEventListener("scroll", handler);
        return () => el.removeEventListener("scroll", handler);
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        setSidebarOpen(false);
    };

    return (
        <div className="w-full bg-gray-950 text-white flex flex-col">

            <div className="flex flex-1 overflow-hidden relative">

                {/* Sidebar overlay (mobile) */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-20 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
          fixed md:sticky top-0  z-20 md:z-auto
          h-full md:h-[calc(100vh-49px)]
          w-56 bg-gray-900 border-r border-gray-800
          flex flex-col shrink-0 overflow-y-auto
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
                    <div className="p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Contents</p>
                        <nav className="space-y-0.5">
                            {NAV.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollTo(item.id)}
                                    className={`
                    w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
                    ${item.indent ? "pl-6 text-xs" : ""}
                    ${active === item.id
                                            ? "bg-gray-800 text-white font-semibold"
                                            : "text-gray-400 hover:text-white hover:bg-gray-800/50"}
                  `}
                                >
                                    {active === item.id && (
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 mb-0.5" />
                                    )}
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main content */}
                <main
                    ref={contentRef}
                    className="flex-1 overflow-y-auto h-[calc(100vh-49px)] px-4 md:px-10 py-8 space-y-12 max-w-3xl mx-auto w-full"
                >

                    {/* ── OVERVIEW ── */}
                    <section>
                        <SectionTitle id="overview" color="emerald">Overview</SectionTitle>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            CipherKit is a browser-based text encryption and decryption toolkit. It supports four
                            classic cipher protocols — <span className="text-emerald-400">Caesar</span>, <span className="text-emerald-400">Vigenère</span>, <span className="text-emerald-400">XOR</span>, and <span className="text-emerald-400">Base64</span> — with a
                            real-time live mode, key auto-generation, and plain-text export. All processing
                            happens entirely client-side; no data is ever transmitted to a server.
                        </p>
                        <Callout type="success">
                            All cipher operations run entirely in your browser. No network requests are made with your text or keys.
                        </Callout>

                        <SubTitle id="">Quick Reference</SubTitle>
                        <CipherTable rows={[
                            ["Cipher", "Key Type", "Reversible", "Encrypt Accent", "Decrypt Accent"],
                            ["Caesar Cipher", "Number (1–25)", "✓ Yes", "emerald-400", "rose-400"],
                            ["Vigenère", "Alphabetic keyword", "✓ Yes", "emerald-400", "rose-400"],
                            ["XOR", "Number (1–254)", "✓ Yes (self-inverse)", "emerald-400", "rose-400"],
                            ["Base64", "None required", "✓ Yes", "emerald-400", "rose-400"],
                        ]} />
                    </section>

                    {/* ── ENCRYPTION ── */}
                    <section>
                        <SectionTitle id="encryption" icon={<FaUnlock />} color="emerald">Encryption Component</SectionTitle>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            The <Tag>Encrypt</Tag> component transforms plaintext into a ciphered output using the
                            selected protocol and key. It is accented in <span className="text-emerald-400 font-semibold">emerald</span> throughout.
                        </p>

                        <SubTitle>Input Constraints</SubTitle>
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-0 mb-4">
                            <InfoRow label="Max Words" value="50 words" />
                            <InfoRow label="Counter" value="Live word count with red warning at limit" />
                            <InfoRow label="Overflow" value="Input blocked beyond 50 words" />
                        </div>

                        <SubTitle>State & Behavior</SubTitle>
                        <p className="text-gray-400 text-sm leading-relaxed mb-3">
                            On cipher switch, both <code className="text-emerald-400 text-xs bg-gray-800 px-1 py-0.5 rounded">encKey</code> and{" "}
                            <code className="text-emerald-400 text-xs bg-gray-800 px-1 py-0.5 rounded">output</code> are reset to empty strings via a{" "}
                            <code className="text-emerald-400 text-xs bg-gray-800 px-1 py-0.5 rounded">useEffect</code> keyed on{" "}
                            <code className="text-emerald-400 text-xs bg-gray-800 px-1 py-0.5 rounded">cipher</code>.
                        </p>
                        <CodeBlock color="emerald">{`useEffect(() => {
  setEncKey("");
  setOutput("");
}, [cipher]);`}</CodeBlock>

                        <SubTitle>Export Filename</SubTitle>
                        <CodeBlock color="emerald">{`encrypted_<cipher_name_snake_case>.txt
// e.g.  encrypted_caesar_cipher.txt
//       encrypted_vigenère.txt
//       encrypted_xor.txt
//       encrypted_base64.txt`}</CodeBlock>
                    </section>

                    {/* ── DECRYPTION ── */}
                    <section>
                        <SectionTitle id="decryption" icon={<FaLock />} color="rose">Decryption Component</SectionTitle>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            The <Tag color="rose">Decrypt</Tag> component is the exact mirror of Encrypt. It takes
                            ciphered text and a matching key, reversing the cipher operation to recover the
                            original plaintext. It is accented in <span className="text-rose-400 font-semibold">rose</span> throughout.
                        </p>

                        <SubTitle>Input Constraints</SubTitle>
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-0 mb-4">
                            <InfoRow label="Max Chars" value="500 characters" />
                            <InfoRow label="Counter" value="Live character count with red warning at limit" />
                            <InfoRow label="Overflow" value="Input blocked beyond 500 chars" />
                        </div>

                        <Callout type="info">
                            Decryption uses a <strong>character limit</strong> (500) rather than a word limit, since
                            cipher output often produces long non-word strings especially with XOR or Base64.
                        </Callout>

                        <SubTitle>Export Filename</SubTitle>
                        <CodeBlock color="rose">{`decrypted_<cipher_name_snake_case>.txt
// e.g.  decrypted_caesar_cipher.txt
//       decrypted_vigenère.txt
//       decrypted_xor.txt
//       decrypted_base64.txt`}</CodeBlock>

                        <SubTitle>Base64 Error Handling</SubTitle>
                        <p className="text-gray-400 text-sm leading-relaxed mb-3">
                            When Base64 input is invalid, the decoder catches the exception and returns a
                            user-facing warning string rather than crashing.
                        </p>
                        <CodeBlock color="rose">{`function base64Decode(text) {
  try {
    return decodeURIComponent(escape(atob(text.trim())));
  } catch {
    return "⚠ Invalid Base64 input";
  }
}`}</CodeBlock>
                    </section>

                    {/* ── CIPHER REFERENCE ── */}
                    <section>
                        <SectionTitle id="ciphers" color="emerald">Cipher Reference</SectionTitle>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Detailed technical breakdown of every supported cipher — algorithm, key format,
                            encryption formula, decryption formula, and usage notes.
                        </p>

                        {/* Caesar */}
                        <div id="caesar" className="scroll-mt-6 bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">01</span>
                                <h3 className="text-white font-bold text-base">Caesar Cipher</h3>
                                <span className="ml-auto"><Tag>Substitution</Tag></span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Each alphabetic character is shifted by a fixed number of positions in the alphabet.
                                Non-alphabetic characters are left unchanged. Case is preserved.
                            </p>
                            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-0 mb-4">
                                <InfoRow label="Key Type" value="Integer (1 – 25)" />
                                <InfoRow label="Default Key" value="3" />
                                <InfoRow label="Alphabet" value="A–Z, a–z only (non-alpha unchanged)" />
                                <InfoRow label="Case" value="Preserved" />
                            </div>
                            <SubTitle>Encrypt Formula</SubTitle>
                            <CodeBlock color="emerald">{`E(c) = (c - base + shift) mod 26 + base
// base = 65 for uppercase, 97 for lowercase
// Example: "Hello" with shift=3 → "Khoor"`}</CodeBlock>
                            <SubTitle>Decrypt Formula</SubTitle>
                            <CodeBlock color="rose">{`D(c) = (c - base - shift + 26) mod 26 + base
// Example: "Khoor" with shift=3 → "Hello"`}</CodeBlock>
                            <div className="mt-4">
                                <Callout type="warn">
                                    Caesar Cipher provides <strong>no real security</strong>. With only 25 possible shifts,
                                    it can be brute-forced instantly. Use for educational purposes only.
                                </Callout>
                            </div>
                        </div>

                        {/* Vigenère */}
                        <div id="vigenere" className="scroll-mt-6 bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">02</span>
                                <h3 className="text-white font-bold text-base">Vigenère Cipher</h3>
                                <span className="ml-auto"><Tag>Polyalphabetic</Tag></span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                A polyalphabetic substitution cipher that uses a repeating keyword. Each letter of
                                the keyword provides a different shift for the corresponding plaintext character,
                                cycling back when the keyword is exhausted.
                            </p>
                            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-0 mb-4">
                                <InfoRow label="Key Type" value="Alphabetic string (auto-uppercased)" />
                                <InfoRow label="Default Key" value="KEY" />
                                <InfoRow label="Key Chars" value="A–Z only (non-alpha stripped)" />
                                <InfoRow label="Key Cycle" value="Repeats — ki mod key.length" />
                            </div>
                            <SubTitle>Encrypt Formula</SubTitle>
                            <CodeBlock color="emerald">{`shift_i = key[ki % key.length].charCodeAt(0) - 65
E(c_i) = (c_i - base + shift_i) mod 26 + base

// Example: "HELLO" with key "KEY"
// K=10, E=4, Y=24, K=10, E=4
// H+10=R, E+4=I, L+24=J, L+10=V, O+4=S → "RIJVS"`}</CodeBlock>
                            <SubTitle>Decrypt Formula</SubTitle>
                            <CodeBlock color="rose">{`D(c_i) = (c_i - base - shift_i + 26) mod 26 + base
// Example: "RIJVS" with key "KEY" → "HELLO"`}</CodeBlock>
                            <div className="mt-4">
                                <Callout type="info">
                                    Non-alphabetic characters are automatically stripped from the key before use.
                                    Only alphabetic characters in the plaintext are shifted — digits and symbols pass through unchanged.
                                </Callout>
                            </div>
                        </div>

                        {/* XOR */}
                        <div id="xor" className="scroll-mt-6 bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">03</span>
                                <h3 className="text-white font-bold text-base">XOR Cipher</h3>
                                <span className="ml-auto"><Tag>Bitwise</Tag></span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Each character's char code is XOR-ed against a numeric key. XOR is self-inverse:
                                applying the same key twice always recovers the original text. This means
                                the encrypt and decrypt operations are identical functions.
                            </p>
                            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-0 mb-4">
                                <InfoRow label="Key Type" value="Integer (1 – 254)" />
                                <InfoRow label="Default Key" value="42" />
                                <InfoRow label="Key Value 0" value="No-op — output equals input" />
                                <InfoRow label="Key Value 255" value="Inverts all bits" />
                            </div>
                            <SubTitle>Encrypt &amp; Decrypt Formula (identical)</SubTitle>
                            <CodeBlock color="emerald">{`output[i] = String.fromCharCode(input[i].charCodeAt(0) ^ key)

// XOR self-inverse property:
// (A ^ K) ^ K = A
// Example: "Hi" with key=42
// 'H'(72) ^ 42 = 98 = 'b'
// 'i'(105) ^ 42 = 67 = 'C'  →  encrypted: "bC"
// 'b'(98)  ^ 42 = 72 = 'H'
// 'C'(67)  ^ 42 = 105 = 'i' →  decrypted: "Hi"`}</CodeBlock>
                            <div className="mt-4">
                                <Callout type="warn">
                                    XOR output may contain non-printable or invisible Unicode characters depending on
                                    the key and input. This is expected. Copying or exporting will preserve all bytes correctly.
                                </Callout>
                            </div>
                        </div>

                        {/* Base64 */}
                        <div id="base64" className="scroll-mt-6 bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">04</span>
                                <h3 className="text-white font-bold text-base">Base64</h3>
                                <span className="ml-auto"><Tag>Encoding</Tag></span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Base64 is a binary-to-text encoding scheme, <strong className="text-white">not</strong> a
                                cipher. It encodes arbitrary data using 64 printable ASCII characters (A–Z, a–z,
                                0–9, +, /, =). It provides <strong className="text-white">no security</strong> — anyone
                                can decode it — but is widely used to safely transport binary or unicode data in
                                text-based contexts.
                            </p>
                            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-0 mb-4">
                                <InfoRow label="Key" value="None required" />
                                <InfoRow label="Alphabet" value="A–Z, a–z, 0–9, +, /, = (padding)" />
                                <InfoRow label="Size ratio" value="~133% of original (every 3 bytes → 4 chars)" />
                                <InfoRow label="Unicode" value="UTF-8 encoded before btoa()" />
                            </div>
                            <SubTitle>Encode (Encrypt)</SubTitle>
                            <CodeBlock color="emerald">{`// UTF-8 safe encoding
btoa(unescape(encodeURIComponent(text)))

// Example: "Hello 🌍" → "SGVsbG8g8J+MjQ=="`}</CodeBlock>
                            <SubTitle>Decode (Decrypt)</SubTitle>
                            <CodeBlock color="rose">{`// UTF-8 safe decoding
decodeURIComponent(escape(atob(text.trim())))

// Invalid input returns: "⚠ Invalid Base64 input"`}</CodeBlock>
                            <div className="mt-4">
                                <Callout type="danger">
                                    Base64 is <strong>not encryption</strong>. It encodes data, it does not protect it.
                                    Never use Base64 to secure sensitive information.
                                </Callout>
                            </div>
                        </div>
                    </section>

                    {/* ── LIVE MODE ── */}
                    <section>
                        <SectionTitle id="livemode" color="emerald">Live Mode</SectionTitle>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            Live Mode re-processes output on every keystroke — text changes, key changes, and
                            cipher switches all trigger immediate re-computation. When Live Mode is disabled,
                            output is only computed when the user clicks the action button.
                        </p>
                        <CipherTable rows={[
                            ["State", "Trigger", "Output updates?"],
                            ["Live ON", "Text change", "✓ Immediately"],
                            ["Live ON", "Key change", "✓ Immediately"],
                            ["Live ON", "Cipher switch", "✗ Reset to empty"],
                            ["Live OFF", "Text / key change", "✗ Not until button click"],
                            ["Live OFF → ON", "Toggle switch", "✓ Re-processes current state"],
                        ]} />
                        <div className="mt-4">
                            <Callout type="info">
                                Switching the cipher always resets the key and output regardless of Live Mode state.
                            </Callout>
                        </div>
                    </section>

                    {/* ── KEYS ── */}
                    <section>
                        <SectionTitle id="keys" color="emerald">Keys &amp; Auto-Generation</SectionTitle>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            The ⚡ auto-key button generates a random key appropriate for the selected cipher.
                            The ranges and formats are:
                        </p>
                        <CipherTable rows={[
                            ["Cipher", "Auto-Key Range / Format", "Example"],
                            ["Caesar Cipher", "Random integer 1–25", "17"],
                            ["Vigenère", "Random alpha string, length 4–8", "KXMRPQ"],
                            ["XOR", "Random integer 1–254", "139"],
                            ["Base64", "Disabled — no key needed", "—"],
                        ]} />
                        <SubTitle>Key Input Rules</SubTitle>
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-0">
                            <InfoRow label="Caesar" value="parseInt(key) || 3  — falls back to 3 if NaN" />
                            <InfoRow label="Vigenère" value="Uppercased, non-alpha stripped, fallback 'KEY'" />
                            <InfoRow label="XOR" value="parseInt(key) || 42 — falls back to 42 if NaN" />
                            <InfoRow label="Base64" value="Key field disabled — always ignored" />
                        </div>
                    </section>

                    {/* ── EXPORT ── */}
                    <section>
                        <SectionTitle id="export" color="emerald">Export</SectionTitle>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            Both components support exporting the processed output as a <code className="text-emerald-400 text-xs bg-gray-800 px-1 py-0.5 rounded">.txt</code> file.
                            Export is disabled when there is no output. The file is created via a Blob URL and
                            auto-downloaded using a programmatic anchor click.
                        </p>
                        <CodeBlock color="emerald">{`const blob = new Blob([output], { type: "text/plain" });
const url  = URL.createObjectURL(blob);
const a    = document.createElement("a");
a.href     = url;
a.download = \`encrypted_\${cipher.replace(/\\s+/g, "_").toLowerCase()}.txt\`;
a.click();
URL.revokeObjectURL(url); // Memory cleanup`}</CodeBlock>
                        <div className="mt-4">
                            <Callout type="info">
                                The Blob URL is immediately revoked after the download is triggered to avoid memory leaks.
                            </Callout>
                        </div>
                    </section>

                    {/* ── LIMITATIONS ── */}
                    <section>
                        <SectionTitle id="limitations" color="rose">Limitations</SectionTitle>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            CipherKit is an educational tool. The following limitations apply:
                        </p>
                        <div className="space-y-3">
                            <Callout type="danger">
                                <strong>No cryptographic security.</strong> Caesar, Vigenère, XOR, and Base64 are
                                all trivially breakable. Do not use CipherKit to protect real sensitive data.
                            </Callout>
                            <Callout type="warn">
                                <strong>Single-byte XOR key.</strong> The XOR implementation uses a single numeric
                                byte as the key, not a repeating keystream. This means identical input bytes always
                                produce identical output bytes — a significant weakness.
                            </Callout>
                            <Callout type="warn">
                                <strong>Word / character limits.</strong> The Encrypt component is limited to 50 words
                                and the Decrypt component to 500 characters. Larger texts cannot be processed.
                            </Callout>
                            <Callout type="info">
                                <strong>Client-side only.</strong> All processing happens in your browser with no
                                persistence. Refreshing the page clears all state.
                            </Callout>
                        </div>

                        <SubTitle>Comparison Table</SubTitle>
                        <CipherTable rows={[
                            ["Property", "Caesar", "Vigenère", "XOR", "Base64"],
                            ["Security Level", "None", "Very Low", "Low", "None (encoding)"],
                            ["Key Space", "25 values", "26^n", "254 values", "—"],
                            ["Reversible", "✓", "✓", "✓", "✓"],
                            ["Handles Unicode", "Alpha only", "Alpha only", "All chars", "✓ (UTF-8)"],
                            ["Key Required", "✓", "✓", "✓", "✗"],
                        ]} />
                    </section>

                </main>
            </div>
        </div>
    );
}