"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useFetch from "@/hooks/useFetch";
import { Item } from "@radix-ui/react-dropdown-menu";
export const description = "A donut chart with text";
const chartData = [
  { status: "pending", count: 275, fill: "var(--color-pending)" },
  { status: "proccessing", count: 200, fill: "var(--color-proccessing)" },
  { status: "shipped", count: 287, fill: "var(--color-shipped)" },
  { status: "delivered", count: 173, fill: "var(--color-delivered)" },
  { status: "cancel", count: 190, fill: "var(--color-cancel)" },
  { status: "unverified", count: 190, fill: "var(--color-unverified)" },
];

const chartConfig = {
  status: {
    label: "Status",
  },
  pending: {
    label: "pending",
    color: "red",
  },
  proccessing: {
    label: "proccessing",
    color: "blue",
  },
  shipped: {
    label: "shipped",
    color: "yellow",
  },
  delivered: {
    label: "delivered",
    color: "green",
  },
  cancel: {
    label: "cancel",
    color: "purple",
  },
  unverified: {
    label: "unverified",
    color: "pink",
  },
};

export function OrderSummary() {
  const [chartData, setChartData] = React.useState([]);
  const [statusCount, setStatusCount] = React.useState();
  const [totalCount, setTotalCount] = React.useState();

  const { data: orderStatus, loading } = useFetch(
    "/api/dashboard/admin/order-status"
  );

  React.useEffect(() => {
    if (orderStatus && orderStatus.success) {
      const newOrderStatus = orderStatus.data.map((o) => ({
        status: o._id,
        count: o.count,
        fill: `var(--color-${o._id})`,
      }));
      setChartData(newOrderStatus);

      const getTotalCount = orderStatus.data.reduce(
        (acc, curr) => acc + curr.count,
        0
      );
      setTotalCount(getTotalCount);

      const statusObj = orderStatus.data.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      },{});
      setStatusCount(statusObj)
    }
  }, [orderStatus]);

  
  return (
    <div className="">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalCount.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Orders
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="">
        <ul className="">
          <li className="flex justify-between items-center mb-3 text-sm">
            <span className="">pending</span>
            <span className="rounded-full px-2 text-white text-sm bg-red-500">
              {statusCount?.pending || 0}
            </span>
          </li>
          <li className="flex justify-between items-center mb-3 text-sm">
            <span className="">proccessing</span>
            <span className="rounded-full px-2 text-white text-sm bg-blue-500">
              {statusCount?.processing || 0}
            </span>
          </li>
          <li className="flex justify-between items-center mb-3 text-sm">
            <span className="">shipped</span>
            <span className="rounded-full px-2 text-white text-sm bg-yellow-500">
              {statusCount?.shipped || 0}
            </span>
          </li>
          <li className="flex justify-between items-center mb-3 text-sm">
            <span className="">delivered</span>
            <span className="rounded-full px-2 text-white text-sm bg-green-500">
              {statusCount?.delivered || 0}
            </span>
          </li>
          <li className="flex justify-between items-center mb-3 text-sm">
            <span className="">cancel</span>
            <span className="rounded-full px-2 text-white text-sm bg-purple-500">
              {statusCount?.cancelled || 0}
            </span>
          </li>
          <li className="flex justify-between items-center mb-3 text-sm">
            <span className="">unverified</span>
            <span className="rounded-full px-2 text-white text-sm bg-pink-500">
              {statusCount?.unverified || 0}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
