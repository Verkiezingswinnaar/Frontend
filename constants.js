export const DATA_URL = "https://verkiezingswinnaar.s3.eu-north-1.amazonaws.com/data.jsonl.gz"
//export const DATA_URL = "http://localhost:63342/data.jsonl.gz"

export const IS_NATIONAL_ELECTION = false

export let TITLE_TEXT = "Welke partij wint de verkiezingen van 2025?"
if (!IS_NATIONAL_ELECTION) {
    TITLE_TEXT = "Welke partij wint de gemeenteraadsverkiezingen van 2026?"
}

export let FILTER_THRESHOLD = 0.5 // 0.5% of the national vote, not even close to a seat.
if (!IS_NATIONAL_ELECTION) {
    // For municipal elections, we don't filter out any parties because we are only reporting relevant parties anyway.
    FILTER_THRESHOLD = -1
}