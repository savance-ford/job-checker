export function selectBestCareersResult<
  T extends { hasConnection: boolean },
>(results: readonly (T | null)[]): T | null {
  return (
    results.find((result) => result?.hasConnection) ??
    results.find((result): result is T => result !== null) ??
    null
  );
}
