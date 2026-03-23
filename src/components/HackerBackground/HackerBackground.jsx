import { useEffect, useRef } from "react";

const BG_COLOR = "#050f0a";
const FONT_SIZE = 14;
const CHARS =
  "0123456789ABCDEF<>{}[]|/\\!@#$%^&*()+=?~`ΨΩΦΣΔΛΘΞαβγδεζηθλμπρστφψω①②③④⑤⑥⑦⑧⑨123456789¥€$£₿✕✗✓⚡☢☣∞≈≠≤≥±×÷∑∏√∫∂∇";

export default function HackerBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    const getRows = () => Math.floor(canvas.height / FONT_SIZE) + 6;
    const getCols = () => Math.floor(canvas.width / FONT_SIZE);

    let columns = [];

    const makeCol = (numRows) => ({
      y: -Math.random() * numRows,
      speed: 0.0000000000000001 + Math.random() * 2,
      // opacity layer per row — pre-multiplied trail values
      chars: Array.from({ length: numRows }, () =>
        CHARS[Math.floor(Math.random() * CHARS.length)]
      ),
    });

    const initCols = () => {
      const n = getCols();
      columns = Array.from({ length: n }, () => makeCol(getRows()));
    };
    initCols();

    const TRAIL = 22;

    // Off-screen buffer to composite the trail onto cleanly
    const buf = document.createElement("canvas");
    const bctx = buf.getContext("2d");

    const syncBuffer = () => {
      buf.width = canvas.width;
      buf.height = canvas.height;
    };
    syncBuffer();
    window.addEventListener("resize", syncBuffer);

    let raf;

    const draw = () => {
      raf = requestAnimationFrame(draw);

      const W = canvas.width;
      const H = canvas.height;
      const numCols = getCols();
      const numRows = getRows();

      // 1. Fill background on buffer
      bctx.fillStyle = BG_COLOR;
      bctx.fillRect(0, 0, W, H);

      bctx.font = `bold ${FONT_SIZE}px 'Courier New', monospace`;
      bctx.textAlign = "left";
      bctx.textBaseline = "top";

      // Sync column count
      while (columns.length < numCols) columns.push(makeCol(numRows));
      columns.length = numCols;

      for (let c = 0; c < numCols; c++) {
        const col = columns[c];
        col.y += col.speed;

        // Mutate a char occasionally for flicker
        if (Math.random() < 0.04) {
          const r = Math.floor(Math.random() * col.chars.length);
          col.chars[r] = CHARS[Math.floor(Math.random() * CHARS.length)];
        }

        // Reset once trail fully exits viewport
        if (col.y - TRAIL > numRows) {
          col.y = -Math.random() * 10;
          col.speed = 0.12 + Math.random() * 0.35;
          col.chars = Array.from({ length: numRows }, () =>
            CHARS[Math.floor(Math.random() * CHARS.length)]
          );
        }

        const x = c * FONT_SIZE;

        for (let i = 0; i < TRAIL; i++) {
          const row = Math.floor(col.y) - i;
          if (row < 0 || row >= numRows) continue;

          const y = row * FONT_SIZE;
          const progress = i / TRAIL; // 0 = head, 1 = tail end

          if (i === 0) {
            // Head — bright white-cyan
            bctx.shadowColor = "#00ffb3";
            bctx.shadowBlur = 16;
            bctx.fillStyle = "rgba(210,255,245,1)";
          } else if (i <= 3) {
            // Near-head — full neon
            bctx.shadowColor = "#00ffb3";
            bctx.shadowBlur = 10;
            bctx.fillStyle = `rgba(0,255,179,${1 - progress * 0.4})`;
          } else if (i <= 10) {
            // Mid trail
            bctx.shadowBlur = 0;
            bctx.fillStyle = `rgba(0,210,140,${1 - progress})`;
          } else {
            // Far tail — dim
            bctx.shadowBlur = 0;
            bctx.fillStyle = `rgba(0,140,90,${Math.max(0, 0.35 - progress * 0.35)})`;
          }

          bctx.fillText(col.chars[row], x, y);
        }

        bctx.shadowBlur = 0;
      }

      // 2. Stamp buffer onto main canvas
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(buf, 0, 0);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
      window.removeEventListener("resize", syncBuffer);
    };
  }, []);

  return (
    <>
      {/* Canvas — fixed so it never affects document flow */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          display: "block",
        }}
      />

      {/* Vignette — also fixed, purely decorative */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(5,15,10,0.85) 100%)",
        }}
      />

      {/* Scanlines */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,179,0.016) 2px, rgba(0,255,179,0.016) 4px)",
        }}
      />
    </>
  );
}
