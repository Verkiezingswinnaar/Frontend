export function getLegend() {
    const DEFAULT_WIDTH = 2;
    const HIGHLIGHT_WIDTH = 5;
    const DIM_WIDTH = 1;

    return {
        onHover: (_, legendItem, legend) => {
            const { chart } = legend;

            chart.data.datasets.forEach((dataset, index) => {
                dataset.borderWidth =
                    index === legendItem.datasetIndex
                        ? HIGHLIGHT_WIDTH
                        : DEFAULT_WIDTH; // Changed to DEFAULT_WIDTH, lowering the thickness makes the graph too jittery.
            });

            chart.update();
        },

        onLeave: (_, __, legend) => {
            const chart = legend.chart;

            chart.data.datasets.forEach(dataset => {
                dataset.borderWidth = DEFAULT_WIDTH;
            });

            chart.update();
        }
    };
}