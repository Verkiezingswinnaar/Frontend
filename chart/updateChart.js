import * as constants from "../constants.js";
import {applyXRange, applyGlobalYRange} from "./axisUpdate.js";

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
        const partyNames = Object.keys(hasReachedThreshold).filter(partyName => hasReachedThreshold[partyName]).sort();

        // Save properties that need to be restored after the dataset is reconstructed
        const isVisible = {};
        const borderWidths = {};
        chartData.datasets.forEach((dataset, index) => {
            isVisible[dataset.label] = chart.isDatasetVisible(index);
            borderWidths[dataset.label] = dataset.borderWidth;
        });

        // Delete the old datasets to ensure that wiping and restoring the JSONL is supported.
        chartData.datasets = []
        let datasetIndex = 0
        for (const partyName of partyNames) {
            const isHidden = isVisible[partyName] === false;
            const borderWidth = borderWidths[partyName] ?? 2;

            const y_axis_key = constants.IS_NATIONAL_ELECTION
                ? "votes_percentage"
                : "relative_vote_change";

            const data = snapshots
                // Filter out parties that didn't participate in both elections.
                // This is relevant when replaying national elections in a municipal election setting
                .filter(snapshot => snapshot.party_snapshots[partyName]?.[y_axis_key] > -100)
                .map(snapshot => {
                    const party_snapshot = snapshot.party_snapshots[partyName];

                    return {
                        x: snapshot.timestamp,
                        y: party_snapshot?.[y_axis_key] ?? null,
                        votesThisElection: party_snapshot?.["votes_this_election"] ?? null,
                        votesLastElection: party_snapshot?.["votes_last_election"] ?? null
                    };
                });
            // Skip this party if there are no results to report for this party due to the above filter.
            if (data.length === 0) {
                continue
            }

            chartData.datasets[datasetIndex] = {
                label: partyName,
                data: data,
                borderWidth: borderWidth,
                tension: 0,
                borderColor: partyColors[partyName],
                backgroundColor: partyColors[partyName],
                hidden: isHidden, // Hide a party again if the party was hidden by the user.
                pointRadius: data.map((value, index, arr) => {
                    // Hide a point if its value is identical to the previous AND the next point
                    if (index > 0
                        && arr[index - 1]
                        && arr[index + 1]
                        && value.y === arr[index - 1].y
                        && value.y === arr[index + 1].y) {
                        return 0;
                    }
                    return 3;
                })
            };
            datasetIndex++
        }

        const timestampLastSnapshot = snapshots.at(-1)?.timestamp ?? 0
        applyXRange(chart, timestampLastSnapshot)
        applyGlobalYRange(chart)

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
