import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink } from 'react-router';
import { HiMiniCodeBracket } from "react-icons/hi2";
import { IoReorderThree } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

const LINKS = [
    { to: "/", label: "ENGINE" },
    { to: "/documentation", label: "DOCS" },
    { to: "/status", label: "STATUS" },
];

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef(null);

    /* close on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    /* scroll shadow trigger */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* lock body scroll when mobile menu open */
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bungee&family=Share+Tech+Mono&display=swap');

        .nav-root {
          font-family: 'Share Tech Mono', monospace;
        }
        .logo-text {
          font-family: 'Bungee', cursive;
        }

        /* animated gradient underline on the whole bar */
        .nav-border-line {
          background: linear-gradient(90deg, #00FFC6, #15A4FF, #00FFC6);
          background-size: 200% 100%;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }

        /* desktop link hover bar */
        .nav-link-item {
          position: relative;
          padding-bottom: 4px;
          letter-spacing: 0.12em;
          font-size: 0.78rem;
          transition: color 0.2s;
        }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%;
          width: 0; height: 1.5px;
          background: #00FFC6;
          transition: width 0.25s ease, left 0.25s ease;
          border-radius: 2px;
        }
        .nav-link-item:hover::after,
        .nav-link-item.active-link::after {
          width: 100%; left: 0;
        }
        .nav-link-item.active-link {
          color: #00FFC6;
        }
        .nav-link-item:hover {
          color: #e2e8f0;
        }

        /* mobile drawer slide-in */
        .mobile-drawer {
          transform: translateX(-100%);
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .mobile-drawer.open {
          transform: translateX(0);
        }

        /* mobile link */
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          font-size: 0.8rem;
          letter-spacing: 0.14em;
          color: #64748b;
          border-left: 2px solid transparent;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .mobile-nav-link:hover {
          color: #e2e8f0;
          background: rgba(0,255,198,0.04);
          border-left-color: rgba(0,255,198,0.3);
        }
        .mobile-nav-link.active-link {
          color: #00FFC6;
          border-left-color: #00FFC6;
          background: rgba(0,255,198,0.06);
        }

        /* glow button */
        .src-btn {
          position: relative;
          overflow: hidden;
          transition: color 0.2s, box-shadow 0.2s;
        }
        .src-btn:hover {
          color: #0A0F14;
          box-shadow: 0 0 16px rgba(0,255,198,0.35);
        }
        .src-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #00FFC6;
          transform: translateX(-101%);
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
          z-index: 0;
        }
        .src-btn:hover::before {
          transform: translateX(0);
        }
        .src-btn span, .src-btn svg {
          position: relative;
          z-index: 1;
        }

        /* status dot pulse */
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.5); }
        }
        .status-dot {
          animation: pulse-dot 2s ease-in-out infinite;
        }

        /* backdrop for mobile overlay */
        .drawer-backdrop {
          background: rgba(5,8,12,0.7);
          backdrop-filter: blur(4px);
        }
      `}</style>

            <nav className={`nav-root z-50 sticky top-0 w-full bg-[#0F1923]/95 backdrop-blur-xl
        transition-shadow duration-300 ${scrolled ? 'shadow-[0_4px_32px_rgba(0,0,0,0.5)]' : ''}`}>

                {/* main bar */}
                <div className="flex items-center justify-between px-5 md:px-10 lg:px-20 h-[58px]">

                    {/* LEFT: hamburger + logo */}
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden flex items-center justify-center w-8 h-8 text-[#00FFC6] hover:bg-[#00FFC6]/10 rounded transition-colors"
                            onClick={() => setMenuOpen(p => !p)}
                            aria-label="Toggle menu"
                        >
                            <IoReorderThree className="text-2xl" />
                        </button>

                        <NavLink to="/" className="flex items-center gap-2 group">
                            {/* small icon accent */}
                            <div className="w-1.5 h-5 bg-[#00FFC6] rounded-sm group-hover:h-6 transition-all duration-200" />
                            <span className="logo-text text-[#00FFC6] text-xl tracking-wide leading-none">
                                CRYPTIC
                            </span>
                            <span className="logo-text text-white text-xl tracking-wide leading-none">
                                ENGINE
                            </span>
                        </NavLink>
                    </div>

                    {/* CENTER: desktop links */}
                    <div className="hidden lg:flex items-center gap-8">
                        {LINKS.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={to === "/"}
                                className={({ isActive }) =>
                                    `nav-link-item text-[#64748b] ${isActive ? 'active-link' : ''}`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </div>

                    {/* RIGHT: status pill + CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* live status indicator — hidden on xs */}
                        <div className="hidden sm:flex items-center gap-1.5 bg-[#0A1A14] border border-[#00FFC6]/20 rounded-full px-3 py-1">
                            <span className="status-dot w-1.5 h-1.5 rounded-full bg-[#00FFC6] block" />
                            <span className="text-[#00FFC6] text-[0.65rem] tracking-widest">ONLINE</span>
                        </div>

                        <Link to={'https://github.com/Agontuk19/CrypticEngine.git'}>
                            <button className="src-btn flex items-center gap-1.5 text-[#00FFC6] text-[0.75rem] tracking-widest border border-[#00FFC6]/50 rounded px-4 py-1.5">
                                <HiMiniCodeBracket className="text-sm" />
                                <span>SOURCE</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* animated bottom border */}
                <div className="nav-border-line h-[1.5px] w-full" />
            </nav>

            {/* ── MOBILE DRAWER ── */}
            {/* backdrop */}
            <div
                className={`drawer-backdrop fixed inset-0 z-40 lg:hidden transition-opacity duration-300
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMenuOpen(false)}
            />

            {/* drawer panel */}
            <div
                ref={menuRef}
                className={`mobile-drawer fixed top-0 left-0 z-50 h-full w-64 bg-[#0A0F14]
          border-r border-[#1E2D3D] flex flex-col lg:hidden ${menuOpen ? 'open' : ''}`}
            >
                {/* drawer header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E2D3D]">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-[#00FFC6] rounded-sm" />
                        <span className="logo-text text-[#00FFC6] text-base">CRYPTIC ENGINE</span>
                    </div>
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="text-[#64748b] hover:text-white transition-colors"
                    >
                        <IoMdClose className="text-xl" />
                    </button>
                </div>

                {/* drawer links */}
                <div className="flex flex-col mt-4 flex-1">
                    <p className="text-[#2D3D4E] text-[0.6rem] tracking-[0.2em] px-6 mb-2">NAVIGATION</p>
                    {LINKS.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === "/"}
                            className={({ isActive }) =>
                                `mobile-nav-link ${isActive ? 'active-link' : ''}`
                            }
                            onClick={() => setMenuOpen(false)}
                        >
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </div>

                {/* drawer footer */}
                <div className="px-6 py-5 border-t border-[#1E2D3D]">
                    <div className="flex items-center gap-2 text-[#2D3D4E] text-[0.6rem] tracking-widest">
                        <span className="status-dot w-1.5 h-1.5 rounded-full bg-[#00FFC6] block" />
                        ALL SYSTEMS OPERATIONAL
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavBar;