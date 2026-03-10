export function getTooltip() {
    return {
        callbacks: {
            label: function (context) {
                const votes = context.parsed.y;
                // Convert number to Dutch format (decimal comma, thousands separator)
                const formattedVotes = votes.toLocaleString();

                const rawContext = context.raw
                // Format numbers with Dutch locale
                const votesThisElection = rawContext.votesThisElection.toLocaleString();
                const votesLastElection = rawContext.votesLastElection.toLocaleString();

                // Determine max length of numbers for padding
                const maxLength = Math.max(votesThisElection.length, votesLastElection.length);

                // Pad numbers with non-breaking spaces (\u00A0) to align visually
                const paddedThisElection = votesThisElection.padStart(maxLength, '\u2007');
                const paddedLastElection = votesLastElection.padStart(maxLength, '\u2007');

                return [`${context.dataset.label}: ${formattedVotes}%`,
                    '',
                    `2026: ${paddedThisElection} stemmen`,
                    `2022: ${paddedLastElection} stemmen`
                ];
            }
        }
    }
}