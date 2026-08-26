import React from 'react';

interface ABDMQRCodeSVGProps {
  value?: string;
  size?: number;
  showCenterLogo?: boolean;
  className?: string;
}

export const ABDMQRCodeSVG: React.FC<ABDMQRCodeSVGProps> = ({
  value = '91-8472-9104-5821@abdm',
  size = 200,
  showCenterLogo = false,
  className = '',
}) => {
  const gridCount = 25;
  const cellSize = 10;
  const viewBoxSize = gridCount * cellSize;

  // Hash value deterministically to generate uniform matrix density
  const getModule = (r: number, c: number) => {
    // 1. Top-Left Position Detection Pattern (7x7)
    if (r < 7 && c < 7) {
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    // 2. Top-Right Position Detection Pattern (7x7)
    if (r < 7 && c >= gridCount - 7) {
      const c2 = c - (gridCount - 7);
      if (r === 0 || r === 6 || c2 === 0 || c2 === 6) return true;
      if (r >= 2 && r <= 4 && c2 >= 2 && c2 <= 4) return true;
      return false;
    }
    // 3. Bottom-Left Position Detection Pattern (7x7)
    if (r >= gridCount - 7 && c < 7) {
      const r2 = r - (gridCount - 7);
      if (r2 === 0 || r2 === 6 || c === 0 || c === 6) return true;
      if (r2 >= 2 && r2 <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    // 4. Center Healthcare Logo Cutout (5x5) - only cutout if center logo enabled
    if (showCenterLogo && r >= 10 && r <= 14 && c >= 10 && c <= 14) {
      return false;
    }
    // 5. Bottom-Right Alignment Pattern (5x5)
    if (r >= 16 && r <= 20 && c >= 16 && c <= 20) {
      const r2 = r - 16;
      const c2 = c - 16;
      if (r2 === 0 || r2 === 4 || c2 === 0 || c2 === 4) return true;
      if (r2 === 2 && c2 === 2) return true;
      return false;
    }
    // 6. Timing Patterns
    if (r === 6 || c === 6) return (r + c) % 2 === 0;

    // 7. Deterministic module distribution based on value hash
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }
    const val = Math.abs(Math.sin((r * 37 + c * 19 + hash) * 888));
    return val > 0.44;
  };

  const modules: { x: number; y: number }[] = [];
  for (let r = 0; r < gridCount; r++) {
    for (let c = 0; c < gridCount; c++) {
      if (getModule(r, c)) {
        modules.push({ x: c * cellSize, y: r * cellSize });
      }
    }
  }

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="w-full h-full"
        shapeRendering="crispEdges"
      >
        {/* Crisp White Background Container */}
        <rect width={viewBoxSize} height={viewBoxSize} fill="#ffffff" rx="12" />

        {/* Outer Quiet Zone Margin Padding */}
        <g transform="scale(0.88) translate(15, 15)">
          {/* Data Modules & Corner Eye Blocks */}
          {modules.map((m, idx) => (
            <rect
              key={idx}
              x={m.x}
              y={m.y}
              width={cellSize - 0.5}
              height={cellSize - 0.5}
              fill="#0b1329"
              rx="1.2"
            />
          ))}
        </g>
      </svg>

      {/* OPTIONAL CENTER BRAND BADGE */}
      {showCenterLogo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-1/4 h-1/4 rounded-lg bg-white border border-[#00a896] shadow-md flex items-center justify-center p-0.5">
            <div className="w-full h-full rounded-md bg-[#00a896] text-white flex items-center justify-center font-extrabold text-[10px] shadow-inner">
              ✚
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
