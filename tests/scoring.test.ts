import assert from "node:assert/strict";
import test from "node:test";

import {
  getRecommendation,
} from "../lib/scan/scoring.ts";
import { normalizeRecommendation } from "../lib/types.ts";

test("getRecommendation uses the documented score thresholds", () => {
  assert.equal(getRecommendation(100), "Lower Risk");
  assert.equal(getRecommendation(75), "Lower Risk");
  assert.equal(getRecommendation(74), "Verify First");
  assert.equal(getRecommendation(45), "Verify First");
  assert.equal(getRecommendation(44), "High Caution");
  assert.equal(getRecommendation(0), "High Caution");
});

test("legacy Apply recommendations display as Lower Risk", () => {
  assert.equal(normalizeRecommendation("Apply"), "Lower Risk");
});

test("unknown saved recommendations default to Verify First", () => {
  assert.equal(normalizeRecommendation("Unknown"), "Verify First");
});
