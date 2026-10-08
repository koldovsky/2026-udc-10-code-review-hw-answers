import test from "node:test";
import assert from "node:assert/strict";
import { load } from "./_app.js";
const { createDb } = await load("src/db.js");
const { listLoansPage } = await load("src/loans.js");
const staff = { id: 3, role: "librarian" };

test("PR-1 D1: page 1 starts at the first loan", () => {
  const res = listLoansPage(createDb(), staff, { page: 1, pageSize: 2 });
  assert.deepEqual(res.items.map((l) => l.id), [1, 2]);
});

test("PR-1 D2: page size is bounded", () => {
  const res = listLoansPage(createDb(), staff, { page: 1, pageSize: 1_000_000 });
  assert.ok(res.pageSize <= 100, `pageSize ${res.pageSize} accepted as is`);
});

