import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateScore,
  getRecommendation,
} from "../lib/scan/scoring.ts";
import type { ScanSignal } from "../lib/types.ts";
import { normalizeRecommendation } from "../lib/types.ts";

function scoreSignal(
  status: ScanSignal["status"],
  severity: ScanSignal["severity"],
): ScanSignal {
  return {
    label: "Test signal",
    status,
    severity,
    message: "Test signal",
  };
}

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

test("HTTPS is a weak positive signal and cannot produce Lower Risk alone", () => {
  const score = calculateScore([scoreSignal("positive", "info")]);

  assert.equal(score, 56);
  assert.equal(getRecommendation(score), "Verify First");
});

test("public ATS verification is much stronger than HTTPS", () => {
  const httpsScore = calculateScore([scoreSignal("positive", "info")]);
  const verifiedAtsScore = calculateScore([
    scoreSignal("positive", "high"),
  ]);

  assert.equal(httpsScore, 56);
  assert.equal(verifiedAtsScore, 75);
  assert.equal(getRecommendation(verifiedAtsScore), "Lower Risk");
});

test("known ATS detection without verification remains Verify First", () => {
  const score = calculateScore([
    scoreSignal("positive", "info"),
    scoreSignal("positive", "low"),
  ]);

  assert.equal(score, 60);
  assert.equal(getRecommendation(score), "Verify First");
});

test("an exact ATS match receives a strong positive boost", () => {
  const signals = [
    scoreSignal("positive", "info"),
    scoreSignal("positive", "low"),
    scoreSignal("positive", "high"),
  ];
  const score = calculateScore(signals);

  assert.equal(score, 80);
  assert.equal(getRecommendation(score), "Lower Risk");
});

test("an ATS job miss is mild caution and verification errors are neutral", () => {
  const baseSignals = [
    scoreSignal("positive", "info"),
    scoreSignal("positive", "low"),
  ];
  const notFoundSignals = [
    ...baseSignals,
    scoreSignal("warning", "low"),
  ];
  const errorSignals = [
    ...baseSignals,
    scoreSignal("unknown", "info"),
  ];

  assert.equal(calculateScore(notFoundSignals), 55);
  assert.equal(getRecommendation(calculateScore(notFoundSignals)), "Verify First");
  assert.equal(calculateScore(errorSignals), 60);
});

test("multiple strong scam-language warnings still produce High Caution", () => {
  const signals = [
    scoreSignal("positive", "info"),
    scoreSignal("warning", "high"),
    scoreSignal("warning", "high"),
    scoreSignal("warning", "high"),
    scoreSignal("warning", "medium"),
  ];
  const score = calculateScore(signals);

  assert.equal(score, 0);
  assert.equal(getRecommendation(score), "High Caution");
});

test("normal listing details remain Verify First without stronger verification", () => {
  const score = calculateScore([
    scoreSignal("positive", "low"),
    scoreSignal("positive", "low"),
    scoreSignal("positive", "info"),
    scoreSignal("positive", "info"),
    scoreSignal("positive", "info"),
  ]);

  assert.equal(score, 66);
  assert.equal(getRecommendation(score), "Verify First");
});
