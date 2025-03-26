
import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

const WorkoutChart = ({ workouts }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!workouts || workouts.length === 0) return

    // Process data for the chart
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date
      })
      .reverse()

    const labels = last7Days.map((date) => date.toLocaleDateString("en-US", { weekday: "short" }))

    const data = last7Days.map((date) => {
      const dayWorkouts = workouts.filter((workout) => {
        const workoutDate = new Date(workout.createdAt)
        return workoutDate.toDateString() === date.toDateString()
      })

      return dayWorkouts.reduce((total, workout) => total + workout.duration, 0)
    })

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart with premium styling
    const ctx = chartRef.current.getContext("2d")
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Workout Duration (minutes)",
            data,
            fill: true,
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            borderColor: "rgba(99, 102, 241, 1)",
            tension: 0.4,
            pointBackgroundColor: "rgba(99, 102, 241, 1)",
            pointBorderColor: "#fff",
            pointRadius: 6,
            pointHoverRadius: 8,
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
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
            mode: "index",
            intersect: false,
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
              label: (context) => `Duration: ${context.raw} minutes`,
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
            },
            title: {
              display: true,
              text: "Minutes",
              font: {
                family: "'Montserrat', sans-serif",
                size: 14,
                weight: "bold",
              },
              color: "#475569",
              padding: {
                bottom: 10,
              },
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
        elements: {
          line: {
            borderWidth: 3,
          },
        },
        layout: {
          padding: 10,
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
  }, [workouts])

  return <canvas ref={chartRef}></canvas>
}

export default WorkoutChart


