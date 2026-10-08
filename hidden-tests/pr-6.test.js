import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { load } from "./_app.js";
const { createDb } = await load("src/db.js");
const { importMembersFromUpload } = await load("src/imports.js");
const admin = { id: 4, role: "admin" };

function setup() {
  const root = mkdtempSync(path.join(tmpdir(), "imp-"));
  const uploadDir = path.join(root, "uploads");
  mkdirSync(uploadDir);
  writeFileSync(path.join(uploadDir, "ok.csv"), "name,email,phone\nНова,n@example.invalid,+380000000010\n");
  writeFileSync(path.join(root, "outside.csv"), "name,email,phone\nЧужий,x@example.invalid,+380000000099\n");
  return uploadDir;
}

test("PR-6 D1: a file name cannot leave the upload directory", async () => {
  await assert.rejects(importMembersFromUpload(createDb(), admin, "../outside.csv", { uploadDir: setup() }));
});

test("PR-6 D2: imported members get ids nobody else has", async () => {
  const db = createDb();
  db.members.splice(1, 1); // member 2 left; ids are now 1,3,4,5
  await importMembersFromUpload(db, admin, "ok.csv", { uploadDir: setup() });
  const ids = db.members.map((m) => m.id);
  assert.equal(new Set(ids).size, ids.length, `duplicate ids: ${ids.join(",")}`);
});
