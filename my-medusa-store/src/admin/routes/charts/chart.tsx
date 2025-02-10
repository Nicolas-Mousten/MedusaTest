import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { ChartBar, Plus } from "@medusajs/icons";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { sdk } from "../../lib/sdk"
import { useQuery } from "@tanstack/react-query"

type chartComponentInputs = {
  id: string;
  startDate?: string;
  stopDate?: string;
  previousDatesCount?: number;
  labelSlider?: number;
}

const ChartComponent = ({ id, startDate, stopDate, previousDatesCount, labelSlider }:chartComponentInputs) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  
  //Default values for date
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 2);
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  //Query logic ↓
  const table = "order"
  const fields = "*,items.*,summary.paid_total"
  let filters = null;
  if(!startDate && startDate?.length == 0){
    filters = JSON.stringify({
      updated_at: {
        $gte: firstDayOfMonth.toISOString(),
        $lte: new Date().toISOString()
      }
    });
  }else{
    filters = JSON.stringify({
      updated_at: {
        $gte: startDate,
        $lte: stopDate
      }
    });
  }
  
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["fetchData", "order"],
    queryFn: () => sdk.client.fetch(`/admin/fetchQuery?table=${table}&fields=${encodeURIComponent(fields)}&filters=${encodeURIComponent(filters)}`, {
      method: "GET",
    }),
  });
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  //arrange data ↓
  const aggregatedData = data.table.reduce((acc, element) => {
    const date = new Date(element.updated_at).toISOString().split("T")[0]; // Extract YYYY-MM-DD
    acc[date] = (acc[date] || 0) + element.summary.paid_total;
    return acc;
  }, {});

  let maxLabels = labelSlider || 10
  //if there are not enough datapoint when it is in week or days then it sets the surplus dates to 0

  const allDates = Object.keys(aggregatedData).sort();
  const minDate = new Date(allDates[0]);
  const maxDate = new Date(allDates[allDates.length - 1]);

  const filledData: { [key: string]: number } = {};
  for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    filledData[dateStr] = aggregatedData[dateStr] || 0;
  }
  //split into days.
  //split the data over weeks. 
  //if there is to many datapoint then instead split to every second week, 
  //after that split to every month

  //TODO implement 

  //Chart naming logic:
  const firstDate = allDates[0];
  const firstValue = aggregatedData[firstDate];
  const totalValue = firstValue || 0;

  const isCumulative = totalValue > 0;

  const type = isCumulative ? "Accumulated Sales" : "Orders";

  const minMonthYear = `${minDate.toLocaleString('default', { month: 'long' })} ${minDate.getFullYear()}`;
  const maxMonthYear = `${maxDate.toLocaleString('default', { month: 'long' })} ${maxDate.getFullYear()}`;

  useEffect(() => {
    //Chart logic ↓
    if (!chartRef.current) return;
    const canvas = chartRef.current;
    const ctx = canvas.getContext("2d");
    const typedCanvas = canvas as HTMLCanvasElement & { chart?: Chart };
    if (typedCanvas.chart) {
      typedCanvas.chart.destroy();
    }
    const config = {
      type: "line",
      data: {
        labels: Object.keys(filledData),
        datasets: [
          {
            label: `${type} Data - ${minMonthYear} to ${maxMonthYear}`,
            data: Object.values(filledData),
            borderColor: "rgb(75, 192, 192)",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
    };
    typedCanvas.chart = new Chart(ctx!, config);
    return () => {
      if (typedCanvas.chart) {
        typedCanvas.chart.destroy();
      }
    };
  }, [aggregatedData]);

  return (
    <div className="chart-container" style={{ position: "relative", height: "40vh", width: "40vw" }}>
      <canvas
        ref={chartRef}
        aria-label={`Chart ${id}`}
        role="img"
      />
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Chart",
  icon: ChartBar,
});

export default ChartComponent;
