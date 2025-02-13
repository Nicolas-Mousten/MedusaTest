import React from "react";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import ChartRender from "./ChartRenderComponent";

export const chartRequiredFields = {
  startDate: new Date(),
  stopDate: new Date(),
  previousDatesCount: 0,
  labelSlider: 0,
};

type ChartComponentProps = {
  props: {
    startDate?: string;
    stopDate?: string;
    previousDatesCount?: number;
    labelSlider?: number;
  };
};

const ChartDataComponent: React.FC<ChartComponentProps> = ({
  props: { startDate, stopDate, previousDatesCount, labelSlider },
}) => {
  const table = "order";
  const fields = "*,items.*,summary.paid_total";
  const filters = JSON.stringify({
    updated_at: {
      $gte: startDate || chartRequiredFields.startDate,
      $lte: stopDate || chartRequiredFields.stopDate,
    },
  });
  if (previousDatesCount != 0){

  }

  // Fetch Data
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["fetchData", "order", startDate, stopDate],
    queryFn: () =>
      sdk.client.fetch(
        `/admin/fetchQuery?table=${table}&fields=${encodeURIComponent(
          fields
        )}&filters=${encodeURIComponent(filters)}`,
        { method: "GET" }
      ),
  });

  // Aggregate Data
  const aggregatedData = (data?.table || []).reduce(
    (acc: Record<string, number>, element: any) => {
      if (!element.updated_at) return acc;
      const date = new Date(element.updated_at).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + (element.summary?.paid_total || 0);
      return acc;
    },
    {}
  );

  // Fill missing dates
  const filledData: Record<string, number> = {};
  for (
    let d = new Date(startDate || chartRequiredFields.startDate);
    d <= new Date(stopDate || chartRequiredFields.stopDate);
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = d.toISOString().split("T")[0];
    filledData[dateStr] = aggregatedData[dateStr] || 0;
  }

  const filledDates = Object.keys(filledData).sort();
  if (filledDates.length === 0) {
    return <p>No data available for the selected range.</p>;
  }

  labelSlider = labelSlider! | 0
  const minDate = new Date(filledDates[0]);
  const maxDate = new Date(filledDates[filledDates.length - 1]);

  // Chart Naming Logic
  const type = Object.values(filledData).reduce((sum, val) => sum + val, 0) > 0 ? "Accumulated Sales" : "Orders";

  const minMonthYear = `${minDate.getDate()} ${minDate.toLocaleString("default", {
    month: "long",
  })} ${minDate.getFullYear()}`;
  const maxMonthYear = `${maxDate.getDate()} ${maxDate.toLocaleString("default", {
    month: "long",
  })} ${maxDate.getFullYear()}`;

  return (
    <ChartRender
    data={Object.values(filledData)}
    labels={Object.keys(filledData)}
    name={`${type} Data - ${minMonthYear} to ${maxMonthYear}`}
    isLoading={isLoading}
    error={error}
  />
  );
};

export default ChartDataComponent;
