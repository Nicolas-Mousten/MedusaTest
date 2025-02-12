import React, { useEffect, useRef, useLayoutEffect } from "react";
import { Chart } from "chart.js/auto";
import { ChartBar, Plus } from "@medusajs/icons";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { sdk } from "../../lib/sdk"
import { useQuery } from "@tanstack/react-query"

export const chartRequiredFields = { //with default values
  startDate: new Date(),
  stopDate: new Date(),
  previousDatesCount: 0,
  labelSlider: 0
}

type chartComponentInputs = {
  props: {
    id: string;
    startDate?: string;
    stopDate?: string;
    previousDatesCount?: number;
    labelSlider?: number;
  }
}

const ChartComponent = ({ props: {id, startDate, stopDate, previousDatesCount, labelSlider}  }:chartComponentInputs) => {


//   return <div>
//   <h3>test component</h3>
//   <p>ID: {id}</p>
//   <p>Start: {startDate}</p>
//   <p>Stop: {stopDate}</p>
//   <p>previous dates count: {previousDatesCount}</p>
// </div>

  console.log(id, startDate, stopDate, previousDatesCount, labelSlider)
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  //Default values for date
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 2);

  //Query logic ↓
  const table = "order"
  const fields = "*,items.*,summary.paid_total"
  let filters = null;
  if(!startDate && startDate?.length == 0){//fall back if no data given. not implemented
    filters = JSON.stringify({
      updated_at: {
        $gte: startDate,
        $lte: stopDate
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

  //Change this to use Zacks backend for fetching data.
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["fetchData", "order", startDate, stopDate],
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
  console.log(aggregatedData)
  //if there are not enough datapoint when it is in week or days then it sets the surplus dates to 0
  const allDates = Object.keys(aggregatedData).sort();


  const filledData: { [key: string]: number } = {};
  for (let d = new Date(startDate!); d <= new Date(stopDate!); d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    filledData[dateStr] = aggregatedData[dateStr] || 0;
  }

  const filledDates = Object.keys(filledData).sort(); // Ensure sorted order
  const minDate = new Date(filledDates[0]);
  const maxDate = new Date(filledDates[filledDates.length - 1]);
  
  //TODO 
  //split into days.
  //split the data over weeks. 
  //if there is to many datapoint then instead split to every second week, 
  //after that split to every month


  //Chart naming logic:
  const firstDate = allDates[0];
  const firstValue = aggregatedData[firstDate];
  const totalValue = firstValue || 0;

  const isCumulative = totalValue > 0;

  const type = isCumulative ? "Accumulated Sales" : "Orders";

  const minDay = minDate.getDate();
  const maxDay = maxDate.getDate();
  
  const minMonthYear = `${minDay} ${minDate.toLocaleString('default', { month: 'long' })} ${minDate.getFullYear()}`;
  const maxMonthYear = `${maxDay} ${maxDate.toLocaleString('default', { month: 'long' })} ${maxDate.getFullYear()}`;
  
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
