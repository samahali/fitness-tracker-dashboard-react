import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

const WorkoutTypeChart = ({ workoutTypes }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!workoutTypes || Object.keys(workoutTypes).length === 0) return

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const labels = Object.keys(workoutTypes).map((type) => type.charAt(0).toUpperCase() + type.slice(1))

    const data = Object.values(workoutTypes)

    // Premium color palette
    const backgroundColors = [
      "rgba(99, 102, 241, 0.8)", // primary
      "rgba(14, 165, 233, 0.8)", // secondary
      "rgba(139, 92, 246, 0.8)", // accent
      "rgba(16, 185, 129, 0.8)", // success
      "rgba(245, 158, 11, 0.8)", // warning
    ]

    // Create new chart with premium styling
    const ctx = chartRef.current.getContext("2d")
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: backgroundColors,
            borderColor: "#ffffff",
            borderWidth: 3,
            hoverOffset: 15,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            position: "right",
            labels: {
              font: {
                family: "'Poppins', sans-serif",
                size: 12,
              },
              padding: 20,
              usePointStyle: true,
              pointStyle: "circle",
            },
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
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = Math.round((value / total) * 100)
                return `${label}: ${value} (${percentage}%)`
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
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
  }, [workoutTypes])

  return <canvas ref={chartRef}></canvas>
}

export default WorkoutTypeChart