import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

type ChartRendererProps = {
  data: number[];
  labels: string[];
  name: string;
  isLoading?: boolean;
  error?: Error | null;
};

const ChartRender: React.FC<ChartRendererProps> = ({ data, labels, name, isLoading, error }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: name,
            data,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            pointRadius: 3,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });

    return () => {
      chartInstance.current?.destroy();
    };
  }, [data, labels, name]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="chart-container" style={{ position: "relative", height: "38vh", width: "38vw" }}>
      <canvas ref={chartRef} />
    </div>
    );
};

export default ChartRender;
