import { createChart } from "./chart/initializeChart.js";
import { loadData } from "./updateChart.js";

const chart = createChart(document.getElementById("chart"));

loadData(chart);
setInterval(loadData, 5000, chart);

