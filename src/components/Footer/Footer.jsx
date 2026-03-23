import React from 'react';
import { NavLink } from 'react-router';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { HiMiniCodeBracket } from 'react-icons/hi2';
import { FaUnlock, FaLock } from 'react-icons/fa';

const LINKS = [
    { to: '/', label: 'Engine' },
    { to: '/documentation', label: 'Documentation' },
    { to: '/status', label: 'System Status' },
];

const CIPHERS = ['Caesar Cipher', 'Vigenère', 'XOR', 'Base64'];

const SOCIALS = [
    {
        href: 'https://github.com/Agontuk19',
        label: 'GitHub',
        icon: <FaGithub className="text-base" />,
    },
    {
        href: 'https://www.linkedin.com/in/tanjimm/',
        label: 'LinkedIn',
        icon: <FaLinkedin className="text-base" />,
    },
    {
        href: 'https://www.instagram.com/tanjim.ktrt/',
        label: 'Instagram',
        icon: <FaInstagram className="text-base" />,
    },
];

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="w-full bg-[#0A0F14] border-t border-[#1E2D3D]">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bungee&family=Share+Tech+Mono&display=swap');
        .footer-mono  { font-family: 'Share Tech Mono', monospace; }
        .footer-bungee{ font-family: 'Bungee', cursive; }

        /* gradient shimmer on brand line */
        @keyframes f-shimmer {
          0%   { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
        .footer-gradient-text {
          background: linear-gradient(90deg, #00FFC6, #15A4FF, #00FFC6);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: f-shimmer 4s linear infinite;
        }

        .footer-top-line {
          background: linear-gradient(90deg, transparent, #00FFC6, #15A4FF, transparent);
          height: 1px;
        }

        /* social icon hover lift */
        .social-btn {
          transition: color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .social-btn:hover {
          transform: translateY(-2px);
        }
        .social-btn.github:hover   { color: #e2e8f0; box-shadow: 0 4px 12px rgba(226,232,240,0.15); }
        .social-btn.linkedin:hover { color: #0A66C2; box-shadow: 0 4px 12px rgba(10,102,194,0.25); }
        .social-btn.instagram:hover { color: #E1306C; box-shadow: 0 4px 12px rgba(225,48,108,0.25); }

        /* footer nav link underline */
        .f-nav-link {
          position: relative;
          transition: color 0.2s;
          padding-bottom: 2px;
        }
        .f-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: #00FFC6;
          transition: width 0.22s ease;
        }
        .f-nav-link:hover { color: #00FFC6; }
        .f-nav-link:hover::after { width: 100%; }

        /* subtle grid */
        .footer-grid-bg {
          background-image:
            linear-gradient(rgba(0,255,198,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,198,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1);   }
          50%      { opacity:.4; transform:scale(1.6); }
        }
        .pulse { animation: pulse-dot 2.2s ease-in-out infinite; }
      `}</style>

            {/* decorative top line */}
            <div className="footer-top-line w-full" />

            <div className="footer-grid-bg">
                {/* ── MAIN GRID ── */}
                <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 pt-12 pb-8
                        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* COL 1 — Brand */}
                    <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-4">
                        <NavLink to="/" className="flex items-center gap-2 group w-fit">
                            <div className="w-1 h-5 bg-[#00FFC6] rounded-sm group-hover:h-6 transition-all duration-200" />
                            <span className="footer-bungee text-lg leading-none">
                                <span className="text-[#00FFC6]">CRYPTIC</span>
                                <span className="text-white"> ENGINE</span>
                            </span>
                        </NavLink>

                        <p className="footer-mono text-[0.7rem] text-[#3D5066] leading-relaxed max-w-xs">
                            A browser-based cipher toolkit. All operations run client-side — your text never leaves your device.
                        </p>

                        {/* status pill */}
                        <div className="flex items-center gap-2 bg-[#001A12] border border-[#00FFC6]/15 rounded-full px-3 py-1.5 w-fit">
                            <span className="pulse w-1.5 h-1.5 rounded-full bg-[#00FFC6] block" />
                            <span className="footer-mono text-[#00FFC6] text-[0.6rem] tracking-widest">ALL SYSTEMS OPERATIONAL</span>
                        </div>

                        {/* socials */}
                        <div className="flex items-center gap-3 mt-1">
                            {SOCIALS.map(({ href, label, icon, }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className={`social-btn ${label.toLowerCase().split(' ')[0]} w-8 h-8 flex items-center justify-center rounded border border-[#1E2D3D] bg-[#0F1923] text-[#3D5066]`}
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* COL 2 — Navigation */}
                    <div className="flex flex-col gap-3">
                        <p className="footer-mono text-[0.6rem] tracking-[0.2em] text-[#2D3D4E] mb-1">NAVIGATION</p>
                        {LINKS.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className="f-nav-link footer-mono text-[0.75rem] text-[#4A5F74] w-fit"
                            >
                                {label}
                            </NavLink>
                        ))}
                    </div>

                    {/* COL 3 — Ciphers */}
                    <div className="flex flex-col gap-3">
                        <p className="footer-mono text-[0.6rem] tracking-[0.2em] text-[#2D3D4E] mb-1">SUPPORTED CIPHERS</p>
                        {CIPHERS.map((c) => (
                            <div key={c} className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-[#00FFC6]/40 block" />
                                <span className="footer-mono text-[0.73rem] text-[#4A5F74]">{c}</span>
                            </div>
                        ))}
                    </div>

                    {/* COL 4 — Source / Info */}
                    <div className="flex flex-col gap-3">
                        <p className="footer-mono text-[0.6rem] tracking-[0.2em] text-[#2D3D4E] mb-1">PROJECT</p>

                        <a
                            href="https://github.com/Agontuk19/CrypticEngine.git"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 w-fit group"
                        >
                            <FaGithub className="text-[#3D5066] group-hover:text-white transition-colors text-sm" />
                            <span className="f-nav-link footer-mono text-[0.73rem] text-[#4A5F74]">View on GitHub</span>
                        </a>

                        <div className="flex items-center gap-2">
                            <HiMiniCodeBracket className="text-[#3D5066] text-sm" />
                            <span className="footer-mono text-[0.73rem] text-[#4A5F74]">Open Source</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <FaUnlock className="text-[#00FFC6]/40 text-xs" />
                            <span className="footer-mono text-[0.73rem] text-[#4A5F74]">Encrypt Component</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <FaLock className="text-rose-400/40 text-xs" />
                            <span className="footer-mono text-[0.73rem] text-[#4A5F74]">Decrypt Component</span>
                        </div>

                        {/* version badge */}
                        <div className="mt-auto pt-2">
                            <span className="footer-mono text-[0.6rem] tracking-widest text-[#2D3D4E] bg-[#0F1923] border border-[#1E2D3D] rounded px-2 py-1">
                                v1.0.0
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM BAR ── */}
                <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 py-5
                        border-t border-[#1E2D3D]
                        flex flex-col sm:flex-row items-center justify-between gap-3">

                    <p className="footer-mono text-[0.62rem] text-[#2D3D4E] tracking-widest text-center sm:text-left">
                        © {year} CRYPTIC ENGINE — ALL CIPHER OPS CLIENT-SIDE
                    </p>

                    <p className="footer-mono text-[0.62rem] tracking-widest">
                        <span className="footer-gradient-text">ENCODE | ENCRYPT | EVOLVE</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;