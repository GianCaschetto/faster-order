import { DataChartType } from "@/types/types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }: { data: DataChartType }) {
  return <Pie data={data} options={{
    responsive: true,
    maintainAspectRatio: false,
  }}/>;
}
