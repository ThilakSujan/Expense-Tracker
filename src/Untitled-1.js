import { Bar } from "react-chartjs-2";

const TestChart = () => {
  return (
    <Bar
      data={{
        labels: ["A", "B", "C"],
        datasets: [
          {
            label: "Test",
            data: [10, 20, 30],
            backgroundColor: "#4f46e5",
          },
        ],
      }}
    />
  );
};

