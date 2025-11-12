"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useFetch from "@/hooks/useFetch";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const chartConfig = {
  amount: {
    label: "Amount",
    color: "#9478FF",
  },
};

export function OrderOverview() {
  const [chartData, setChartData] = useState([]);

  const { data: monthlySales, loading } = useFetch(
    "/api/dashboard/admin/monthly-sales"
  );

  // ✅ Make chart data generation more reliable
  const formattedData = useMemo(() => {
    if (!monthlySales?.success || !Array.isArray(monthlySales?.data)) {
      return months.map((m) => ({ month: m, amount: 0 }));
    }

    return months.map((month, index) => {
      const monthData = monthlySales.data.find(
        (item) => Number(item?._id?.month) === index + 1
      );

      return {
        month,
        amount: monthData?.totalSales ?? 0,
      };
    });
  }, [monthlySales]);

  useEffect(() => {
    setChartData(formattedData);
  }, [formattedData]);

  return (
    <div>
      <ChartContainer config={chartConfig}>
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(v) => v.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="amount" fill="var(--color-amount)" radius={8} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
