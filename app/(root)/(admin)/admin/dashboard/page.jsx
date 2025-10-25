import React from "react";
import CountOverview from "./CountOverview";
import QuickAdd from "./QuickAdd";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CardContent } from "@mui/material";
import { OrderOverview } from "./OrderOverview";
import { OrderSummary } from "./OrderSummary";
import LatestOrder from "./LatestOrder";
import LatestReview from "./LatestReview";

const AdminDashboard = () => {
  return (
    <div className="my-3">
      <CountOverview />
      <QuickAdd />
      <div className="mt-10 flex lg:flex-nowrap flex-wrap gap-10">
        <Card className="rounded-lg lg:w-[70%] w-full p-0">
          <CardHeader className=" py-2 border-b h-16">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Order Overview</span>
              <Button type="button">
                <Link href={``}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <OrderOverview />
          </CardContent>
        </Card>
        <Card className="rounded-lg lg:w-[30%] w-full p-0">
          <CardHeader className="py-2 border-b h-16">
            <div className="flex  items-center mt-3">
              <span className="font-semibold">Order Summary</span>
            </div>
          </CardHeader>
          <CardContent>
            <OrderSummary />
          </CardContent>
        </Card>
      </div>
      <div className="mt-10 flex lg:flex-nowrap flex-wrap gap-10">
        <Card className="rounded-lg lg:w-[70%] w-full p-0 block">
          <CardHeader className=" py-2 border-b h-16">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Latest Orders</span>
              <Button type="button">
                <Link href={``}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-3 lg:h-[350px] overflow-auto">
            <LatestOrder />
          </CardContent>
        </Card>
        <Card className="rounded-lg lg:w-[30%] w-full p-0 block">
          <CardHeader className="py-2 border-b h-16">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Latest Reviews</span>
              <Button type="button">
                <Link href={``}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-3 lg:h-[350px] overflow-auto">
            <LatestReview />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
