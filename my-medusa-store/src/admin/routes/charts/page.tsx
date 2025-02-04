import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChartBar } from "@medusajs/icons"
import { faker } from "@faker-js/faker"
import { Container, Heading } from "@medusajs/ui"
import { Chart } from "chart.js/auto"
import { useEffect, useRef } from "react"

const ChartsPage = () => {
    const chartRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        if (!chartRef.current) return

        const canvas = chartRef.current
        const ctx = canvas.getContext("2d")

        const typedCanvas = canvas as HTMLCanvasElement & { chart?: Chart }

        if (typedCanvas.chart) {
            typedCanvas.chart.destroy()
        }

        const randomData = Array.from({ length: 10 }, () => faker.number.int({ min: 0, max: 100 }))

        const config = {
            type: "line",
            data: {
                labels: Array.from({ length: 10 }, (_, i) => `Label ${i + 1}`),
                datasets: [
                    {
                        label: "Random Data",
                        data: randomData,
                        borderColor: "rgb(75, 192, 192)",
                        borderWidth: 2,
                        fill: false,
                    },
                ],
            },
        }

        
        typedCanvas.chart = new Chart(ctx!, config)

        return () => {
            if (typedCanvas.chart) {
                typedCanvas.chart.destroy()
            }
        }
    }, [])

    return (
        <Container className="divide-y p-4">
            <Heading className="mb-4">Charts</Heading>
            <div className="flex justify-center">
                <canvas ref={chartRef} width="400" height="100" aria-label="Chart" role="img">
                    <p>Here there will be charts</p>
                    <p>Cha, cha, charts, cha, cha, charts</p>
                </canvas>
            </div>
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Charts",
    icon: ChartBar,
})

export default ChartsPage
