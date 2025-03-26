import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

const GoalProgressChart = ({ goals }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!goals || goals.length === 0) return

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const statusCounts = {
      "In Progress": goals.filter((goal) => goal.status === "in_progress").length,
      Achieved: goals.filter((goal) => goal.status === "achieved").length,
      Failed: goals.filter((goal) => goal.status === "failed").length,
    }

    // Create new chart with premium styling
    const ctx = chartRef.current.getContext("2d")
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(statusCounts),
        datasets: [
          {
            label: "Goal Status",
            data: Object.values(statusCounts),
            backgroundColor: [
              "rgba(245, 158, 11, 0.8)", // In Progress - warning
              "rgba(16, 185, 129, 0.8)", // Achieved - success
              "rgba(239, 68, 68, 0.8)", // Failed - danger
            ],
            borderColor: ["rgba(245, 158, 11, 1)", "rgba(16, 185, 129, 1)", "rgba(239, 68, 68, 1)"],
            borderWidth: 2,
            borderRadius: 8,
            maxBarThickness: 80,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            titleColor: "#1e293b",
            bodyColor: "#475569",
            borderColor: "rgba(203, 213, 225, 0.5)",
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            titleFont: {
              family: "'Montserrat', sans-serif",
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              family: "'Poppins', sans-serif",
              size: 12,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(203, 213, 225, 0.2)",
              drawBorder: false,
            },
            ticks: {
              font: {
                family: "'Poppins', sans-serif",
                size: 12,
              },
              padding: 10,
              color: "#64748b",
              precision: 0,
            },
          },
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              font: {
                family: "'Poppins', sans-serif",
                size: 12,
              },
              padding: 10,
              color: "#64748b",
            },
          },
        },
        animation: {
          duration: 2000,
          easing: "easeOutQuart",
        },
      },
    })

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [goals])

  return <canvas ref={chartRef}></canvas>
}

export default GoalProgressChart

