import { SpinningLogo } from "@/icons/SpinningLogo";
import { IGetItemCost } from "@/types/items";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {
  items: IGetItemCost[];
  loading: boolean;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    name: string;
    unit: string;
    value: number;
    payload: IGetItemCost; 
  }>;
  label?: string;
}

interface CustomXAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
    offset: number;
    coordinate: number;
    index: number;
  };
  angle: number; 
  textAnchor: string; 
  width?: number;
}

const CustomXAxisTick = ({ x, y, payload, angle, textAnchor }: CustomXAxisTickProps) => {
  const text = payload?.value;
  const fontSize = 12; 
  
  const charLimit = 12; 

  let displayedText = text;
  if (text && text.length > charLimit) {
    displayedText = text.substring(0, charLimit) + "...";
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor={textAnchor} fill="#666" transform={`rotate(${angle})`} fontSize={fontSize}>
        {displayedText}
      </text>
    </g>
  );
};


export const CostChart = ({ items, loading }: Props) => {
  if (loading) return <SpinningLogo />;

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      const avgProfit = data.avgProfit ?? 0;
      const totalSold = data.totalSold ?? 0;

      const totalProfit = (avgProfit * totalSold).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      const avgProfitUnit = avgProfit.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-300">
          <p className="label">{`Produto: ${label}`}</p>
          <p className="intro">{`Lucro Unitário Médio: ${avgProfitUnit}`}</p>
          <p className="intro">{`Lucro Total dos Itens Vendidos: ${totalProfit}`}</p>
          <p className="intro">{`Quantidade Total Vendida: ${totalSold.toLocaleString("pt-BR")}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row flex-wrap sm:flex-nowrap items-center">
        <ResponsiveContainer width="45%" height={200}>
          <BarChart
            data={items}
            margin={{
              top: 5,
              right: 30,
              left: 60, 
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="name"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={<CustomXAxisTick angle={-45} textAnchor="end" width={80} />} 
            />
            <YAxis tickCount={5} /> 
            <Tooltip formatter={(value: number) => (value ?? 0).toLocaleString("pt-BR")} />
            <Legend />
            <Bar dataKey="totalSold" fill="#1C7EF4" name="Quantidade total vendida" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="45%" height={200}>
          <BarChart
            data={items?.slice().sort((a, b) => ((b.avgProfit ?? 0) * (b.totalSold ?? 0)) - ((a.avgProfit ?? 0) * (a.totalSold ?? 0)))} 
            margin={{
              top: 5,
              right: 30,
              left: 60, 
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="name"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={<CustomXAxisTick angle={-45} textAnchor="end" width={80} />} 
            />
            <YAxis
              tickCount={5} 
              tickFormatter={(value) =>
                (value ?? 0).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2, 
                })
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey={(data) => (data.avgProfit ?? 0) * (data.totalSold ?? 0)}
              fill="#16A34A"
              name="Lucro Total de Itens Vendidos"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap sm:flex-nowrap items-center">
        <ResponsiveContainer width="45%" height={200}>
          <BarChart
            data={items?.slice().sort((a, b) => (b.avgCostPrice ?? 0) - (a.avgCostPrice ?? 0))} 
            margin={{
              top: 5,
              right: 30,
              left: 60, 
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="name"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={<CustomXAxisTick angle={-45} textAnchor="end" width={80} />} 
            />
            <YAxis
              tickCount={5} 
              tickFormatter={(value) =>
                (value ?? 0).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                const isNumeric = typeof value === "number";

                return [
                  isNumeric
                    ? (value ?? 0).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : value,
                  name,
                ];
              }}
            />
            <Legend />
            <Bar dataKey="avgCostPrice" fill="#525252" name="Custo médio" />
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="45%" height={200}>
          <BarChart
            data={items?.slice().sort((a, b) => (b.totalRevenue ?? 0) - (a.totalRevenue ?? 0))} 
            margin={{
              top: 5,
              right: 30,
              left: 60, 
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="name"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={<CustomXAxisTick angle={-45} textAnchor="end" width={80} />} 
            />
            <YAxis
              tickCount={5} 
              tickFormatter={(value) =>
                (value ?? 0).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                const isNumeric = typeof value === "number";

                return [
                  isNumeric
                    ? (value ?? 0).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : value,
                  name,
                ];
              }}
            />
            <Legend />
            <Bar dataKey="totalRevenue" fill="#D97706" name="Valor total vendido" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};