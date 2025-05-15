import { useState, useEffect, useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Transactions } from "../Context";

export default function AnimatedHorizontalBarChart() {
  const { transactions } = useContext(Transactions);
  const [chartData, setChartData] = useState([
    { name: "Entertainment", value: 0 },
    { name: "Food", value: 0 },
    { name: "Travel", value: 0 },
  ]);

  useEffect(() => {
    const categoryMap = {
      entertainment: 0,
      food: 0,
      travel: 0,
    };

    transactions.forEach((transaction) => {
      const categoryKey = transaction.category.toLowerCase();
      if (categoryMap.hasOwnProperty(categoryKey)) {
        categoryMap[categoryKey] += Number(transaction.amount) || 0;
      }
    });

    // Trigger animation: delay setting actual data
    setTimeout(() => {
      setChartData([
        { name: "Entertainment", value: categoryMap.entertainment },
        { name: "Food", value: categoryMap.food },
        { name: "Travel", value: categoryMap.travel },
      ]);
    }, 100); // Small delay triggers the animation from 0
  }, [transactions]);

  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        backgroundColor: "#fff",
        borderRadius: "8px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ left: 80, right: 20, top: 20, bottom: 20 }}
          barGap={20}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 16 }}
          />
          <Bar
            dataKey="value"
            barSize={20}
            radius={[0, 20, 20, 0]}
            fill="#8884d8"
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#8884d8" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
