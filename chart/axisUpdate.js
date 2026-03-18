let globalUnchangedXMax = 0

export function applyXRange(chart, timestampLastSnapshot) {
    // Change the end of the x-axis to the whole hour after the end of the most recent snapshot.
    // And the start of the x-axis 1.5 hours before that.
    const msToHour = 3600 * 1000

    let currentXMin = chart.options.scales.x.min
    let currentXMax = chart.options.scales.x.max

    // If the user hasn't changed the x-axis from its default,
    // automatically add more whitespace when new data comes in.
    if (currentXMin === undefined || globalUnchangedXMax === currentXMax) {
        currentXMax = Math.ceil(timestampLastSnapshot / msToHour) * msToHour;
        currentXMin = currentXMax - 1.5 * msToHour
        globalUnchangedXMax = currentXMax
    }
    chart.options.scales.x.min = currentXMin
    chart.options.scales.x.max = currentXMax
}

export function applyGlobalYRange(chart) {
    const range = computeGlobalYRange(chart);

    chart.options.scales.y.min = range.min;
    chart.options.scales.y.max = range.max;
}

function computeGlobalYRange(chart) {
    let minY = Infinity;
    let maxY = -Infinity;

    chart.data.datasets.forEach(dataset => {
        // Ignore hidden datasets, so that the y-axis gets updated when the user hides a party
        if (!dataset.hidden) {
            dataset.data.forEach(dataPoint => {
                const yValue = dataPoint.y
                if (yValue < minY) {
                    minY = yValue;
                }
                if (yValue > maxY) {
                    maxY = yValue;
                }
            });
        }
    });

    if (minY === Infinity) {
        minY = -100
    }
    if (maxY === -Infinity) {
        maxY = 100
    }

    // Add a 10 point buffer above the highest datapoint (and below the lowest).
    // This behaves more predictively than a relative buffer depending on the range of the y-axis.
    const fixedBuffer = 10
    maxY = maxY + fixedBuffer
    minY = minY - fixedBuffer

    // Always round to the nearest 10 points for a consistent stepsize.
    const roundingTarget = 10
    maxY = Math.ceil(maxY / roundingTarget) * roundingTarget
    minY = Math.floor(minY / roundingTarget) * roundingTarget

    return {
        min: minY,
        max: maxY
    };
}