import { useState, useEffect, useContext } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Transactions } from "../Context";


const COLORS = ["#A000FF", "#FF9304", "#FDE006"];

export default function CustomPieChart() {
  const { transactions } = useContext(Transactions);
  const [chartData, setChartData] = useState([
    { name: "Food", value: 0 },
    { name: "Entertainment", value: 0 },
    { name: "Travel", value: 0 },
  ]);
  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const RADIAN = Math.PI / 180;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    const categoryMap = {
      food: 0,
      entertainment: 0,
      travel: 0,
    };

    transactions.forEach((transaction) => {
      const categoryKey = transaction.category.toLowerCase();
      const amount = Number(transaction.amount) || 0;
      if (categoryMap.hasOwnProperty(categoryKey)) {
        categoryMap[categoryKey] += amount;
      }
    });

    setChartData([
      { name: "Food", value: categoryMap.food },
      { name: "Entertainment", value: categoryMap.entertainment },
      { name: "Travel", value: categoryMap.travel },
    ]);
  }, [transactions]);

  return (
    <div
      style={{ width: "355.41px", height: "260px", backgroundColor: "#626262" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            startAngle={0}
            endAngle={-360}
            outerRadius={80}
            fill="#8884d8"
            label={renderLabel}
            labelLine={false}
            isAnimationActive={true}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#333",
              borderColor: "#444",
              color: "#fff",
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType='triangle'
            wrapperStyle={{ color: "#ffffff" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
