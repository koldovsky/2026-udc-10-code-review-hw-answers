# UDC Workshop 10 — ключ відповідей до черги рев'ю

Це **окреме** репо для домашки
[`2026-udc-10-code-review-hw`](https://github.com/koldovsky/2026-udc-10-code-review-hw).

> **Клонуйте його лише після першого прогону вашого AI-рев'юера (Task B).**
> Тримайте поза репо домашки: агент, який рев'юїть код, не повинен бачити ключ,
> інакше ваші precision і recall нічого не означають.

```bash
# з теки, де лежить ваш клон домашки
git clone https://github.com/koldovsky/2026-udc-10-code-review-hw-answers.git
```

- [`ANSWER-KEY.md`](ANSWER-KEY.md) — дефекти кожного PR і правила підрахунку.
- `hidden-tests/pr-N.test.js` — тест, що доводить кожен дефект: червоний на PR у
  поданому вигляді, зелений на правильному виправленні (для PR-4 — зелений одразу).

```bash
# у клоні домашки: застосувати PR, запустити прихований тест
git apply review-queue/pr-3/change.diff
APP_DIR=$PWD/app node --test ../2026-udc-10-code-review-hw-answers/hidden-tests/pr-3.test.js
git checkout -- app && git clean -fd app   # повернутись до бази
```
