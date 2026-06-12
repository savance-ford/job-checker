import assert from "node:assert/strict";
import test from "node:test";

import { selectBestCareersResult } from "../lib/company/selectCareersResult.ts";

test("selectBestCareersResult prioritizes an ATS-connected result", () => {
  const generic = {
    careersUrl: "https://example.com/jobs",
    hasConnection: false,
  };
  const connected = {
    careersUrl: "https://example.com/careers",
    hasConnection: true,
  };

  assert.equal(
    selectBestCareersResult([generic, null, connected]),
    connected,
  );
});

test("selectBestCareersResult otherwise preserves candidate order", () => {
  const first = {
    careersUrl: "https://example.com/jobs",
    hasConnection: false,
  };
  const second = {
    careersUrl: "https://example.com/careers",
    hasConnection: false,
  };

  assert.equal(selectBestCareersResult([null, first, second]), first);
  assert.equal(selectBestCareersResult([null, null]), null);
});
