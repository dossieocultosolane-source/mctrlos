"use client";

interface SiloVisualProps {
  nome: string;
  atual: number;
  max: number;
  sensorAtivo: boolean;
  selected?: boolean;
  onClick?: () => void;
  onValueChange?: (value: number) => void;
  showSensorIndicator?: boolean;
  size?: "normal" | "large";
}

export function SiloVisual({
  nome,
  atual,
  max,
  sensorAtivo,
  selected,
  onClick,
  onValueChange,
  showSensorIndicator,
  size = "normal",
}: SiloVisualProps) {
  const percent = Math.min(100, (atual / max) * 100);
  const fillHeight = (percent / 100) * (size === "large" ? 100 : 70);

  const width = size === "large" ? 100 : 70;
  const height = size === "large" ? 140 : 100;
  const bodyHeight = size === "large" ? 100 : 70;

  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
        selected ? "scale-105" : ""
      }`}
    >
      {/* Nome do silo */}
      <span className="text-xs font-semibold text-white">{nome}</span>

      {/* SVG do Silo 3D */}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          {/* Gradiente metalico para o corpo */}
          <linearGradient id={`siloBody-${nome}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a5568" />
            <stop offset="20%" stopColor="#718096" />
            <stop offset="50%" stopColor="#a0aec0" />
            <stop offset="80%" stopColor="#718096" />
            <stop offset="100%" stopColor="#4a5568" />
          </linearGradient>

          {/* Gradiente para o topo */}
          <linearGradient id={`siloTop-${nome}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a0aec0" />
            <stop offset="100%" stopColor="#718096" />
          </linearGradient>

          {/* Gradiente para o cone inferior */}
          <linearGradient id={`siloCone-${nome}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a5568" />
            <stop offset="50%" stopColor="#718096" />
            <stop offset="100%" stopColor="#4a5568" />
          </linearGradient>

          {/* Gradiente para o preenchimento */}
          <linearGradient id={`siloFill-${nome}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Clip path para o preenchimento */}
          <clipPath id={`siloClip-${nome}`}>
            <rect x="5" y={10 + (bodyHeight - fillHeight)} width={width - 10} height={fillHeight} />
          </clipPath>
        </defs>

        {/* Topo do silo (elipse) */}
        <ellipse
          cx={width / 2}
          cy="10"
          rx={width / 2 - 5}
          ry="8"
          fill={`url(#siloTop-${nome})`}
          stroke="#4a5568"
          strokeWidth="1"
        />

        {/* Corpo do silo */}
        <rect
          x="5"
          y="10"
          width={width - 10}
          height={bodyHeight}
          fill={`url(#siloBody-${nome})`}
          stroke="#4a5568"
          strokeWidth="1"
        />

        {/* Preenchimento */}
        <rect
          x="8"
          y={10 + (bodyHeight - fillHeight)}
          width={width - 16}
          height={fillHeight}
          fill={`url(#siloFill-${nome})`}
          opacity="0.9"
        />

        {/* Cone inferior */}
        <polygon
          points={`5,${10 + bodyHeight} ${width - 5},${10 + bodyHeight} ${width / 2},${height - 5}`}
          fill={`url(#siloCone-${nome})`}
          stroke="#4a5568"
          strokeWidth="1"
        />

        {/* Saida do cone */}
        <rect
          x={width / 2 - 5}
          y={height - 8}
          width="10"
          height="8"
          fill="#4a5568"
          rx="2"
        />

        {/* Borda de selecao */}
        {selected && (
          <rect
            x="2"
            y="2"
            width={width - 4}
            height={height - 4}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            rx="4"
          />
        )}
      </svg>

      {/* Valores */}
      <div className="text-center">
        <div className="text-xs font-bold text-white">
          {Math.round(atual).toLocaleString("pt-BR")} kg
        </div>
        <div className="text-[10px] text-gray-400">
          {Math.round(max).toLocaleString("pt-BR")} kg
        </div>
        <div className="text-[10px] text-gray-400">{percent.toFixed(0)}%</div>
      </div>

      {/* Indicadores de sensor para PM */}
      {showSensorIndicator && (
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1">
            <div
              className={`w-3 h-3 rounded-full ${
                sensorAtivo ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-red-900"
              }`}
            />
          </div>
          <span className="text-[9px] text-gray-400 uppercase">Sensor Alto</span>
        </div>
      )}

      {showSensorIndicator && (
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        </div>
      )}
    </div>
  );
}
