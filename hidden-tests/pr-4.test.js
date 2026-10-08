import test from "node:test";
import assert from "node:assert/strict";
import { load } from "./_app.js";
const { daysBetween, addDays, lateFee } = await load("src/loans.js");

// The base implementation, copied verbatim, as the oracle.
const toUtc = (iso) => Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)));
const baseDaysBetween = (a, b) => Math.round((toUtc(b) - toUtc(a)) / 86_400_000);
const baseAddDays = (iso, d) => new Date(toUtc(iso) + d * 86_400_000).toISOString().slice(0, 10);
const baseFee = (loan, on) => { const l = baseDaysBetween(loan.dueAt, loan.returnedAt ?? on); return l > 0 ? l * 500 : 0; };

test("PR-4: the refactor preserves behaviour on 2 000 date pairs", () => {
  let d = "2025-12-20";
  for (let i = 0; i < 2000; i++) {
    const e = baseAddDays(d, (i * 7) % 61 - 20);
    assert.equal(daysBetween(d, e), baseDaysBetween(d, e));
    assert.equal(addDays(d, i % 45), baseAddDays(d, i % 45));
    const loan = { dueAt: d, returnedAt: i % 3 ? null : e };
    assert.equal(lateFee(loan, e), baseFee(loan, e));
    d = baseAddDays(d, 1);
  }
});

