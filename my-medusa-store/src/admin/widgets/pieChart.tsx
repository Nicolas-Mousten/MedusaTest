// import { defineWidgetConfig } from "@medusajs/admin-sdk"
// import { Container, Heading } from "@medusajs/ui"
// import { useEffect, useRef } from "react"
// import Chart from "chart.js/auto"

// const PieChartWidget = () => {
//   const chartRef = useRef<HTMLCanvasElement | null>(null)

//   useEffect(() => {
//     if (!chartRef.current) return

//     const canvas = chartRef.current
//     const ctx = canvas.getContext("2d")

//     const typedCanvas = canvas as HTMLCanvasElement & { chart?: Chart }

//     if (typedCanvas.chart) {
//         typedCanvas.chart.destroy()
//     }

//     const config = {
//       type: "pie",
//       data: {
//         labels: ["Category A", "Category B", "Category C"],
//         datasets: [
//           {
//             data: [45, 25, 30],
//             backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
//           },
//         ],
//       },
//     };

//     typedCanvas.chart = new Chart(ctx!, config)

//     return () => {
//       if (typedCanvas.chart) {
//         typedCanvas.chart.destroy()
//       }
//     };
//   }, [])

//   return (
//     <Container className="divide-y p-0">
//       <Heading level="h2">Pie Chart</Heading>
//       <div>
//         <canvas ref={chartRef} width="300" height="300"></canvas>
//       </div>
//     </Container>
//   )
// }

// export const config = defineWidgetConfig({
//   zone: "charts.after",
// })

// export default PieChartWidget
