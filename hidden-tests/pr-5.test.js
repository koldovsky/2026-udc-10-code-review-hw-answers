import test from "node:test";
import assert from "node:assert/strict";
import { load } from "./_app.js";
const { lateFee } = await load("src/loans.js");

test("PR-5 D2: a loan returned before 1 November keeps the old fee", () => {
  // due 2026-10-04, returned 2026-10-07: three days late under the old rules
  assert.equal(lateFee({ dueAt: "2026-10-04", returnedAt: "2026-10-07" }, "2026-10-08"), 1500);
});

test("PR-5: after 1 November the first late day is free", () => {
  assert.equal(lateFee({ dueAt: "2026-11-10", returnedAt: "2026-11-13" }, "2026-11-14"), 1000);
});

