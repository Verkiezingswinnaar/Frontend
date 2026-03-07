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
                }
            },
            ticks: {
                autoSkip: true,
                stepSize: 5
            }
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
            }
        }
    };
}