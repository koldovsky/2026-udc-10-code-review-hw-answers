// Hidden tests import the app under test from APP_DIR (the `app/` folder with a
// PR applied). Usage, from the homework repo root:
//   APP_DIR=$PWD/app node --test ../2026-udc-10-code-review-hw-answers/hidden-tests/pr-3.test.js
import path from "node:path";
import { pathToFileURL } from "node:url";

const APP_DIR = process.env.APP_DIR;
if (!APP_DIR) throw new Error("set APP_DIR to the app/ folder with the PR applied");

export const load = (rel) => import(pathToFileURL(path.join(APP_DIR, rel)).href);
