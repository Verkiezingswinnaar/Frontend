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

                const scaleDuration = scale.max - scale.min
                const minutesToMs = 60 * 1000;
                const hoursToMs = 60 * 60 * 1000

                let stepsize = 5 * minutesToMs
                if (scaleDuration > 2 * hoursToMs) {
                    stepsize = 15 * minutesToMs
                }
                if (scaleDuration > 4 * hoursToMs) {
                    stepsize = 30 * minutesToMs
                }
                if (scaleDuration > 8 * hoursToMs) {
                    stepsize = 60 * minutesToMs
                }
                const start = Math.ceil(scale.min / stepsize) * stepsize;
                const end = scale.max;

                for (let t = start; t <= end; t += stepsize) {
                    ticks.push({ value: t });
                }

                scale.ticks = ticks;
            },
            grid: {
                drawBorder: false,
                color: function(ctx) {
                    // Color all Midnight grid lines black
                    // Color all 1-hour grid lines dark gray
                    // Color all other grid lines light gray
                    if (ctx.tick) {
                        const d = new Date(ctx.tick.value);
                        if (d.getHours() === 0 && d.getMinutes() === 0) {
                            return "rgba(0,0,0,0.6)"
                        }
                        if (d.getMinutes() === 0) {
                            return "rgba(0,0,0,0.2)"
                        }
                        return "rgba(0,0,0,0.08)"
                    }
                },
                lineWidth: function(ctx) {
                    // Make the midnight grid lines fat
                    if (ctx.tick) {
                        const d = new Date(ctx.tick.value);
                        return (d.getHours() === 0 && d.getMinutes() === 0) ? 2 : 1;
                    }
                }
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
            },
            ticks: {
                callback: function(value) {
                    return value + '%';
                }
            }
        }
    };
}