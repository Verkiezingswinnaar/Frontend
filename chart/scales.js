import * as constants from "../constants.js";

export function getScales() {
    const yText = constants.IS_NATIONAL_ELECTION
        ? "Prognose stemmen (%)"
        : "Groei stemmen sinds 2022 (%)";

    return {
        x: {
            type: "time",
            time: {
                unit: "minute",
                displayFormats: {
                    minute: "HH:mm"
                },
                tooltipFormat: 'dd MMM yyyy, HH:mm', // fallback format
            },
            afterBuildTicks: scale => {
                const ticks = [];
                const fiveMinutesInMs = 5 * 60 * 1000

                const start = Math.ceil(scale.min / fiveMinutesInMs) * fiveMinutesInMs ;
                const end = scale.max;

                for (let t = start; t <= end; t += fiveMinutesInMs) {
                    ticks.push({ value: t });
                }

                scale.ticks = ticks;
            },
        },

        y: {
            beginAtZero: true,
            display: true,
            title: {
                display: true,
                text: yText,
                font: {
                    size: 18,
                    weight: "bold",
                    lineHeight: 1.2
                }
            },
            ticks: {
                callback: function(value) {
                    return value + '%';
                }
            }
        }
    };
}