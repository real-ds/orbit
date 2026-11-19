"use client";

import { collectionRunSources, collectionRuns } from "@/data/dummy";
import { formatRelativeTime } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  completed: "Completed",
  running: "Running",
  failed: "Failed",
  partial: "Partial",
};

/**
 * Operational summary of the most recent scheduled collection run.
 * Backed by `collection_runs` and `collection_run_sources`, which the worker
 * writes on every execution.
 */
export function CollectionActivity() {
  const latestRun = collectionRuns[0];

  if (!latestRun) {
    return (
      <section className="run">
        <h3>Latest collection</h3>
        <p className="run__empty">No collection run recorded yet.</p>
      </section>
    );
  }

  const status = latestRun.status;
  const runSources = collectionRunSources.filter((entry) => entry.runId === latestRun.id);

  return (
    <section className="run">
      <h3>Latest collection</h3>

      <dl className="run__list">
        <div className="run__row">
          <dt>Status</dt>
          <dd>
            <span className={`run__status run__status--${status}`}>
              {STATUS_LABEL[status] ?? status}
            </span>
          </dd>
        </div>
        <div className="run__row">
          <dt>Articles added</dt>
          <dd>{latestRun.articlesInserted}</dd>
        </div>
        <div className="run__row">
          <dt>Duplicates skipped</dt>
          <dd>{latestRun.articlesDuplicated}</dd>
        </div>
        <div className="run__row">
          <dt>Sources processed</dt>
          <dd>
            {latestRun.sourcesProcessed}
            {latestRun.sourcesFailed > 0 && (
              <span className="run__failed"> · {latestRun.sourcesFailed} failed</span>
            )}
          </dd>
        </div>
        <div className="run__row">
          <dt>Last run</dt>
          <dd>{latestRun.completedAt ? formatRelativeTime(latestRun.completedAt) : "Never"}</dd>
        </div>
      </dl>

      {runSources.length > 0 && (
        <details className="run__sources">
          <summary>Per-source results</summary>
          <ul>
            {runSources.map((entry) => (
              <li key={entry.id}>
                <span className={`run__dot run__dot--${entry.status}`} aria-hidden="true" />
                <span className="run__source-name">{entry.sourceName}</span>
                <span className="run__source-count">{entry.articlesNew}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
