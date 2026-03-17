import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

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
    <div className="industrial-card p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Progresso da Produção
      </h3>
      <div className="flex items-center gap-4">
        <div className="w-[140px] h-[140px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
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
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value} un`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-foreground">{pct}%</span>
          </div>
        </div>
        <div className="flex-1 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-success" />
            <span className="text-muted-foreground">Produzida</span>
            <span className="ml-auto font-mono font-semibold text-foreground">{produzida}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-muted" />
            <span className="text-muted-foreground">Restante</span>
            <span className="ml-auto font-mono font-semibold text-foreground">{restante}</span>
          </div>
          <div className="border-t border-border/50 pt-2 mt-2">
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
