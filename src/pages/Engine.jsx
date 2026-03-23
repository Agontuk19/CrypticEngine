import React, { useState } from 'react';
import Encrypt from '../components/Encrypt/Encrypt';
import Decrypt from '../components/Decrypt/Decrypt';
import { FaUnlock, FaLock } from 'react-icons/fa';

const Engine = () => {
    const [encrypt, setEncrypt] = useState(true);

    return (
        <div className='flex flex-col items-center w-full text-white bg-[#0A0F14]'>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

                .engine-mono { font-family: 'Share Tech Mono', monospace; }

                /* shimmer scan line across the header label */
                @keyframes scan {
                    0%   { transform: translateX(-100%); }
                    100% { transform: translateX(400%); }
                }
                .scan-line::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 30%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(0,255,198,0.12), transparent);
                    animation: scan 3.5s linear infinite;
                }

                /* toggle pill glow */
                .toggle-pill {
                    background: #0F1923;
                    border: 1px solid #1E2D3D;
                    box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);
                }
                .toggle-thumb-encrypt {
                    background: linear-gradient(135deg, #00FFC6, #00D4A8);
                    box-shadow: 0 0 14px rgba(0,255,198,0.4);
                }
                .toggle-thumb-decrypt {
                    background: linear-gradient(135deg, #fb7185, #e11d48);
                    box-shadow: 0 0 14px rgba(251,113,133,0.4);
                }

                /* mode badge flash on switch */
                @keyframes badge-pop {
                    0%   { opacity: 0; transform: translateY(-4px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0)   scale(1); }
                }
                .badge-anim { animation: badge-pop 0.2s ease forwards; }

                /* subtle grid bg */
                .grid-bg {
                    background-image:
                        linear-gradient(rgba(0,255,198,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,255,198,0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}</style>

            {/* ── Header strip ── */}
            <div className="grid-bg w-full flex flex-col items-center pt-10 px-4 border-b border-[#1E2D3D]">

                {/* toggle */}
                <div className="toggle-pill relative flex items-center rounded-full p-1 w-52">
                    {/* sliding thumb */}
                    <div
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                            ${encrypt ? 'toggle-thumb-encrypt left-1' : 'toggle-thumb-decrypt left-[calc(50%+3px)]'}`}
                    />

                    <button
                        onClick={() => setEncrypt(true)}
                        className={`relative z-10 flex items-center justify-center gap-1.5 w-1/2 py-2 rounded-full text-xs font-semibold tracking-wider transition-colors duration-300 engine-mono
                            ${encrypt ? 'text-[#003D2E]' : 'text-[#3D5066]'}`}
                    >
                        <FaUnlock className="text-[0.6rem]" />
                        ENCRYPT
                    </button>
                    <button
                        onClick={() => setEncrypt(false)}
                        className={`relative z-10 flex items-center justify-center gap-1.5 w-1/2 py-2 rounded-full text-xs font-semibold tracking-wider transition-colors duration-300 engine-mono
                            ${!encrypt ? 'text-[#4A0018]' : 'text-[#3D5066]'}`}
                    >
                        <FaLock className="text-[0.6rem]" />
                        DECRYPT
                    </button>
                </div>

                {/* active mode badge */}
                <div key={encrypt ? 'enc' : 'dec'} className={`badge-anim mt-3 flex items-center gap-1.5 engine-mono text-[0.58rem] tracking-[0.2em]
                    ${encrypt ? 'text-[#00FFC6]' : 'text-rose-400'}`}>
                    <p className='mb-1'>
                        <span className={`w-1.5 h-1.5 rounded-full ${encrypt ? 'bg-[#00FFC6]' : 'bg-rose-400'}`} />
                        {encrypt ? 'ENCRYPTION MODE ACTIVE' : 'DECRYPTION MODE ACTIVE'}
                    </p>
                </div>
            </div>

            {/* ── Component area ── */}
            <div className="w-full flex justify-center py-8">
                {encrypt ? <Encrypt /> : <Decrypt />}
            </div>
        </div>
    );
};

export default Engine;