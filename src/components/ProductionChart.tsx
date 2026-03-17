import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ProductionChartProps {
  produzida: number;
  restante: number;
  meta: number;
}

export const ProductionChart = ({ produzida, restante, meta }: ProductionChartProps) => {
  const data = [
    { name: "Produzida", value: produzida },
    { name: "Restante", value: restante },
  ];

  const COLORS = ["hsl(var(--success))", "hsl(var(--muted))"];

  const pct = meta > 0 ? ((produzida / meta) * 100).toFixed(1) : "0.0";

  return (
    <div className="industrial-card p-3">
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        Progresso da Produção
      </h3>
      <div className="flex items-center gap-3">
        <div className="w-[110px] h-[110px] relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={48}
                dataKey="value"
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                  fontSize: "11px",
                }}
                formatter={(value: number) => [`${value} un`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-foreground">{pct}%</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Produzida</span>
            <span className="ml-auto font-mono font-semibold text-foreground">{produzida}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted" />
            <span className="text-muted-foreground">Restante</span>
            <span className="ml-auto font-mono font-semibold text-foreground">{restante}</span>
          </div>
          <div className="border-t border-border/50 pt-1.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Meta</span>
              <span className="font-mono font-semibold text-foreground">{meta}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
