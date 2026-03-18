import { createChart } from "./chart/initializeChart.js";
import { loadData } from "./chart/updateChart.js";

const chart = createChart(document.getElementById("chart"));

loadData(chart);
setInterval(loadData, 30000, chart);

