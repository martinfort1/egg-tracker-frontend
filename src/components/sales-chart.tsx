"use client"
import { formatCurrency, formatNumber } from "@/lib/utils";
import { BarChart2 } from "lucide-react"
import {
    Bar,
    BarChart,
    Legend,
    Rectangle,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

// Custom shape component for conditional bar coloring
const CustomProfitBar = (props: any) => {
  const { fill, x, y, width, height, payload } = props;
  
  // Determine color based on profit value
  const color = payload?.profit >= 0 ? "#108700" : "#660700";
  
  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill={color}
      radius={[8, 8, 0, 0]}
    />
  );
};
const compactFormatter = new Intl.NumberFormat("es-AR", {
  notation: "compact",
});

// Custom tooltip to show profit color information
const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;
  
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border-2 border-slate-800 rounded shadow-lg">
        <p className="text-slate-800 font-bold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => {
          const isProfit = entry.name === "Profit Margin";
          const value = typeof entry.value === "number" ? entry.value : Number(entry.value);
          const displayColor = isProfit
            ? value >= 0
              ? "#108700"
              : "#660700"
            : entry.color || "#000000";
          const displayText = isProfit
            ? value >= 0
              ? "Profit Margin (Positive)"
              : "Profit Margin (Negative)"
            : entry.name;

          return (
            <p key={index} style={{ color: displayColor }}>
              {displayText}: {formatCurrency(value || 0)}
            </p>
          );
        })}
      </div>
    );
  }
  
  return null;
};

const legendPayload = [
  { value: "Revenue", type: "rect", id: "revenue", color: "#1eff00" },
  { value: "Expenses", type: "rect", id: "expenses", color: "#ff1100" },
  {
    value: "Profit Margin (Green:+, Red:-)",
    type: "rect",
    id: "profit",
    color: "#108700",
  },
];

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex justify-center gap-4 text-sm mt-2">
      {payload.map((entry: any, index: number) => (
        <span key={index} className="flex items-center gap-1">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </span>
      ))}
    </div>
  );
};

export function SalesChart({data, period}: any) {

    return(
        <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-2xl">
            <div className=" flex flex-col items-center text-center gap-2 bg-linear-to-b from-slate-800 to-slate-700  text-white">
                <BarChart2 className="bg-linear-to-b from-yellow-400 to-orange-500 text-white-500 mt-4"/>
                <h2 className="mb-4 font-semibold">
                    { period === "7d" || period === "30d" ? "Weekly": "Monthly"} Margins Chart 
                </h2>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} barGap={4} barCategoryGap={8}>
                    <XAxis dataKey="label" />
                    <YAxis tickFormatter={(value) => `$${compactFormatter.format(value)}`} />
                        <ReferenceLine
                        y={0}
                        stroke="#000000"
                        strokeWidth="1"
                        />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend payload={legendPayload}/>} verticalAlign="bottom" height={36}/>
                    <Bar 
                        dataKey="revenue"
                        fill="#1eff00" 
                        radius={[8, 8, 0, 0]}
                        name="Revenue"
                        />
                    <Bar 
                        dataKey="expenses"
                        fill="#ff1100"  
                        radius={[8, 8, 0, 0]}
                        name="Expenses"
                        />
                    <Bar 
                        dataKey="profit"
                        shape={<CustomProfitBar />}
                        fill="#108700"
                        name="Profit Margin"
                        />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}