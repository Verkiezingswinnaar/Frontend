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
                        : DIM_WIDTH;
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