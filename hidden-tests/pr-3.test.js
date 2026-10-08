import test from "node:test";
import assert from "node:assert/strict";
import { load } from "./_app.js";
const { createDb } = await load("src/db.js");
const { exportMembersCsv } = await load("src/members.js");
const { AccessDenied } = await load("src/auth.js");

test("PR-3 D1: a member cannot export everyone's contacts", () => {
  assert.throws(() => exportMembersCsv(createDb(), { id: 1, role: "member" }), AccessDenied);
});

test("PR-3 D2: a name with a comma stays one CSV field", () => {
  const db = createDb();
  db.members[0].name = "Приклад, Оля";
  const row = exportMembersCsv(db, { id: 4, role: "admin" }).split("\n")[1];
  assert.match(row, /"Приклад, Оля"/);
});

