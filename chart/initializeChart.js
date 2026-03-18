
import { getLegend } from "./plugins/legend.js";
import { getTitle } from "./plugins/title.js";
import { getScales } from "./scales.js";
import { getTooltip } from "./plugins/tooltip.js";
import { getZoom } from "./plugins/zoom.js";

export function createChart(ctx) {
    return new Chart(ctx, {
        type: "line",
        data: {},
        options: {
            responsive: true,
            maintainAspectRatio: false,
            parsing: false,

            interaction: {
                mode: "nearest",
                intersect: false
            },
            animation: false,

            plugins: {
                legend: getLegend(),
                title: getTitle(),
                tooltip: getTooltip(),
                zoom: getZoom(),
                decimation: {
                    enabled: true,
                    algorithm: "lttb"
                }
            },

            scales: getScales()
        }
    });
}