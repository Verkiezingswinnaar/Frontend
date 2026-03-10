
import * as constants from "./constants.js";

const partyColors = {
    LOKAAL: "#1ABC9C",
    VVD: "#1F4E9E",        // Blue
    PVV: "#003366",        // Dark Blue
    CDA: "#008B45",        // Green
    D66: "#00A859",        // Bright Green
    SP: "#E30613",         // Red
    FVD: "#7A1F1F",        // Dark Red
    PVDD: "#006400",       // Dark Green
    CU: "#00AEEF",         // Light Blue
    SGP: "#FF7F00",        // Orange
    DENK: "#0CA678",       // Green
    JA21: "#1F2A44",       // Dark Blue
    BBB: "#92C83E",        // Farmer Green
    VOLT: "#5A2D82",       // Purple
    BIJ1: "#000000",       // Black
    GLPVDA: "#D9480F",
    "50PLUS": "#800080"
};

/**
 * @param {Chart} chart -
 */
export async function loadData(chart) {
    fetchGzipJSONL(constants.DATA_URL)
        .then(snapshots => {
            console.log("JSONL data:", snapshots);
            processData(chart, snapshots)
        })
        .catch(err => {
            console.error("Error reading gzipped JSONL:", err);
        });
}

function processData(chart, snapshots) {
    try {
        const chartData = chart.data
        const hasReachedThreshold = {}

        // Filter out all parties that are unlikely to get a seat
        // (=less than 0.5% (default) of the expected votes in all timestamps)
        for (const snapshot of snapshots) {
            for (const [partyName, partySnapshot] of Object.entries(snapshot.party_snapshots)) {
                if (!hasReachedThreshold[partyName]) {
                    hasReachedThreshold[partyName] =
                        partySnapshot.votes_percentage > constants.FILTER_THRESHOLD;
                }
            }
        }

        // Get all parties that have reached the threshold
        const partyNames = Object.keys(hasReachedThreshold).filter(key => hasReachedThreshold[key]).sort();

        // Check whether a party was marked as 'hidden' by the user before the update
        const isVisible = {};
        chartData.datasets.forEach((dataset, index) => {
            isVisible[dataset.label] = chart.isDatasetVisible(index);
        });

        let datasetIndex = 0
        for (const partyName of partyNames) {
            const existingDataset = chartData.datasets[datasetIndex];

            const isHidden = isVisible[partyName] === false;
            const borderWidth = existingDataset?.borderWidth ?? 2;

            const y_axis_key = constants.IS_NATIONAL_ELECTION
                ? "votes_percentage"
                : "relative_vote_change";

            const data = snapshots.map(snapshot => {
                const party_snapshot = snapshot.party_snapshots[partyName];
                return {
                    x: snapshot.timestamp,
                    y: party_snapshot?.[y_axis_key] ?? null,
                    votesThisElection: party_snapshot?.["votes_this_election"] ?? null,
                    votesLastElection: party_snapshot?.["votes_last_election"] ?? null
                };
            });

            chartData.datasets[datasetIndex] = {
                label: partyName,
                data: data,
                borderWidth: borderWidth,
                tension: 0.2,
                borderColor: partyColors[partyName],
                backgroundColor: partyColors[partyName],
                hidden: isHidden // Hide a party again if the party was hidden by the user.
            };
            datasetIndex++
        }

        // Change the end of the x-axis to the whole hour after the end of the most recent snapshot.
        // And the start of the x-axis to the closest 5 minutes before the first snapshot.
        const lastSnapshot = snapshots.at(-1)
        const msToHour = 3600 * 1000

        chart.options.scales.x.max = Math.ceil(lastSnapshot.timestamp / msToHour) * msToHour;

        const firstSnapshot = snapshots.at(0)
        const msTo5Min = 300 * 1000
        chart.options.scales.x.suggestedMin = Math.floor(firstSnapshot.timestamp / msTo5Min) * msTo5Min;

        chart.update('none');

        updateLiveTimestamp()

    } catch (err) {
        console.error("Data fetch failed:", err);
    }
}

async function fetchGzipJSONL(url) {
    // Fetch gzip file as ArrayBuffer
    const response = await fetch(url, {cache: 'no-store'});
    const compressedBuffer = await response.arrayBuffer();

    // Decompress using pako
    const decompressed = pako.ungzip(new Uint8Array(compressedBuffer));

    // Convert to string
    const text = new TextDecoder('utf-8').decode(decompressed);

    // Split into lines and parse each JSON object
    const lines = text.split("\n").filter(line => line.trim() !== "");
    const data = lines.map(line => JSON.parse(line));

    return data;
}

function updateLiveTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    document.getElementById("live-text").textContent =
        "Live - Laatste update: " + timeString;
}

const refreshBtn = document.getElementById("refresh-btn");

refreshBtn.addEventListener("click", async () => {
    refreshBtn.disabled = true;
    updateLiveTimestamp();
    console.log("As you expected, this button isn't actually doing anything. Please send any blame to my friend who suggested to add such a button")
    setTimeout(() => refreshBtn.disabled = false, 2000);
});
