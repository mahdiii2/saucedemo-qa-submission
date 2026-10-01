#!/usr/bin/env bash
# Preserve each real command exit code and its artifacts before the next stage.
set -uo pipefail
label="$1"
shift
destination="ci-evidence/$label"
mkdir -p "$destination" || exit 1
started="$(date --iso-8601=seconds)"
printf '%q ' "$@" > "$destination/command.txt"
printf '\n' >> "$destination/command.txt"
"$@" 2>&1 | tee "$destination/console.log"
statuses=("${PIPESTATUS[@]}")
code="${statuses[0]}"
capture_code="${statuses[1]}"
for directory in test-results playwright-report; do
  if [ -d "$directory" ]; then
    mv "$directory" "$destination/" || capture_code=1
  fi
done
printf '{"startedAt":"%s","completedAt":"%s","exitCode":%s,"captureExitCode":%s}\n' \
  "$started" "$(date --iso-8601=seconds)" "$code" "$capture_code" > "$destination/execution.json" || exit 1
printf '| %s | %s | %s |\n' "$label" "$code" "$capture_code" >> "$GITHUB_STEP_SUMMARY"
if [ "$capture_code" -ne 0 ]; then exit 1; fi
exit "$code"
