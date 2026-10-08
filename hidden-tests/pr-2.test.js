import test from "node:test";
import assert from "node:assert/strict";
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

