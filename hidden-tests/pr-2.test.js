import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { load } from "./_app.js";
const { createDb } = await load("src/db.js");
const { overdueReport } = await load("src/loans.js");
const staff = { id: 3, role: "librarian" };

test("PR-2 D1: the report does not look members up row by row", () => {
  const db = createDb();
  for (let i = 0; i < 2000; i++) {
    db.loans.push({ id: 1000 + i, memberId: 1 + (i % 5), bookId: 101, takenAt: "2026-08-01", dueAt: "2026-08-15", returnedAt: null });
  }
  let calls = 0;
  const real = db.findMember;
  db.findMember = (id) => { calls++; return real(id); };
  const rows = overdueReport(db, staff, "2026-10-08");
  assert.ok(rows.length > 2000);
  assert.ok(calls <= db.members.length, `findMember called ${calls} times for ${rows.length} rows`);
});

test("PR-2 D2 (team rule 2): returning members' emails is recorded in the access log", () => {
  const db = createDb();
  const rows = overdueReport(db, staff, "2026-10-08");
  const withEmail = new Set(rows.filter((r) => r.email).map((r) => r.loanId));
  assert.ok(withEmail.size > 0);
  assert.ok(db.accessLog.length > 0, "emails returned, access log empty");
});

test("PR-2 D3 (team rule 4): money leaves src/ only as integer kopecks", () => {
  const rows = overdueReport(createDb(), staff, "2026-10-08");
  for (const r of rows) {
    for (const [k, v] of Object.entries(r)) {
      if (/fee/i.test(k)) assert.ok(Number.isInteger(v), `${k} = ${JSON.stringify(v)}`);
    }
  }
});

test("PR-2 D4 (team rule 6): the changed report shape is in the CHANGELOG", () => {
  const log = readFileSync(path.join(process.env.APP_DIR, "CHANGELOG.md"), "utf8");
  assert.match(log, /overdueReport[^\n]*email|email[^\n]*overdueReport/i);
});
