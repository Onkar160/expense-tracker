import { useState, useEffect, useContext } from "react";
import { Chart } from "react-google-charts";
import { Transactions } from "../Context";

export default function CustomPieChart() {
  const [data, setData] = useState([
    ["Category", "Amount"],
    ["Food", 0],
    ["Entertainment", 0],
    ["Travel", 0],
  ]);

  const { transactions } = useContext(Transactions);

  useEffect(() => {
    // console.log(transactions);
    if (transactions?.length) {
      let categoryMap = {
        food: 0,
        entertainment: 0,
        travel: 0,
      };

      transactions.forEach((transaction) => {
        let categoryKey = transaction.category.toLowerCase();
        let amount = Number(transaction.amount) || 0;
        if (categoryMap.hasOwnProperty(categoryKey)) {
          categoryMap[categoryKey] += amount;
        }
      });

      setData([
        ["Category", "Amount"],
        ["Food", categoryMap.food],
        ["Entertainment", categoryMap.entertainment],
        ["Travel", categoryMap.travel],
      ]);
    }
  }, [transactions]);

  const options = {
    backgroundColor: "#626262",
    pieSliceBorderColor: "transparent",
    colors: ["#A000FF", "#FF9304", "#FDE006"],
    pieStartAngle: 120,
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: "#ffffff",
      },
    },
    slices: {
      0: { color: "#A000FF", visibleInLegend: true },
      1: { color: "#FF9304", visibleInLegend: true },
      2: { color: "#FDE006", visibleInLegend: true },
    },
    chartArea: {
      backgroundColor: "#626262", // Optional: Set chart area background separately
      left: 0,
      top: 0,
      width: "100%",
      height: "80%",
    },
  };

  return (
    <div style={{ width: "355.41px", height: "230px" }}>
      <Chart
        chartType="PieChart"
        data={data}
        width={"100%"}
        height="100%"
        options={options}
      />
    </div>
  );
}
