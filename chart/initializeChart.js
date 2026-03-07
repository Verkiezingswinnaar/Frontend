
import { getLegend } from "./plugins/legend.js";
import { getTitle } from "./plugins/title.js";
import { getScales } from "./scales.js";
import { getTooltip } from "./plugins/tooltip.js";

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

            plugins: {
                legend: getLegend(),
                title: getTitle(),
                tooltip: getTooltip()
            },

            scales: getScales()
        }
    });
}