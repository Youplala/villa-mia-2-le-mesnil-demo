/* ============================================================
   Static Local Business — content loader
   Reads business.json and fills the page. Designed to fail
   gracefully: the HTML already contains good fallback content,
   so if this script never runs the site still looks right.

   Supported attributes
   --------------------
   data-field="a.b.c"       → element.textContent = data.a.b.c
   data-link="a.b.c"        → element.href        = data.a.b.c
   data-attr-<name>="path"  → element.setAttribute(name, value)
   data-list="a.b"          → render a list; element must contain
                              a <template> with the row markup.
                              Inside the template, paths are
                              resolved against each row.
   ============================================================ */

(() => {
  "use strict";

  const DATA_URL = "business.json";

  function get(obj, path) {
    if (!obj || !path) return undefined;
    return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
  }

  function setText(el, value) {
    if (value == null || value === "") return;
    el.textContent = String(value);
  }

  function applyAttrs(el, scope) {
    for (const attr of Array.from(el.attributes)) {
      if (!attr.name.startsWith("data-attr-")) continue;
      const target = attr.name.slice("data-attr-".length);
      const value = get(scope, attr.value);
      if (value != null && value !== "") el.setAttribute(target, String(value));
    }
  }

  /**
   * Fill one element against the given data scope.
   * Returns true if the element is a list root (caller should skip subtree).
   */
  function applyOne(el, scope) {
    if (el.hasAttribute("data-field")) {
      setText(el, get(scope, el.getAttribute("data-field")));
    }
    if (el.hasAttribute("data-link")) {
      const v = get(scope, el.getAttribute("data-link"));
      if (v) el.setAttribute("href", String(v));
    }
    applyAttrs(el, scope);
    return el.hasAttribute("data-list");
  }

  /** Walk an element's subtree (excluding self), filling against scope.
   *  When it hits a [data-list], it renders that list and skips its subtree. */
  function fillSubtree(root, scope) {
    const stack = Array.from(root.children);
    while (stack.length) {
      const el = stack.pop();
      if (el.tagName === "TEMPLATE") continue;
      const isList = applyOne(el, scope);
      if (isList) {
        renderList(el, scope);
        continue; // skip its subtree (managed by renderList)
      }
      for (const child of el.children) stack.push(child);
    }
  }

  /** Render a [data-list] element. The element holds a <template> describing
   *  one row. Any other children of the list are fallback content and are
   *  removed once we have data. */
  function renderList(listEl, parentScope) {
    const path = listEl.getAttribute("data-list");
    const items = get(parentScope, path);
    if (!Array.isArray(items) || items.length === 0) return; // keep fallback

    const tpl = listEl.querySelector(":scope > template");
    if (!tpl) return;

    for (const child of Array.from(listEl.children)) {
      if (child !== tpl) child.remove();
    }

    const fragment = document.createDocumentFragment();
    for (const item of items) {
      const node = tpl.content.firstElementChild?.cloneNode(true);
      if (!node) continue;
      applyOne(node, item);
      fillSubtree(node, item);
      fragment.appendChild(node);
    }
    listEl.insertBefore(fragment, tpl);
  }

  /** Highlight today's row in the hours table, fill the "Aujourd'hui" line. */
  function highlightToday(data) {
    const schedule = get(data, "hours.schedule");
    if (!Array.isArray(schedule) || schedule.length === 0) return;

    // JS Sunday=0..Saturday=6 → business.json uses Monday..Sunday by convention.
    const jsDay = new Date().getDay();
    const idx = jsDay === 0 ? 6 : jsDay - 1;
    const entry = schedule[idx];

    const todayEl = document.querySelector("[data-today]");
    if (todayEl && entry) todayEl.textContent = `${entry.day} · ${entry.hours}`;

    const rows = document.querySelectorAll(".hours-table tbody tr");
    if (rows[idx]) rows[idx].setAttribute("data-today", "");
  }

  function fillPage(data) {
    fillSubtree(document.documentElement, data);

    const year = document.querySelector("[data-year]");
    if (year) year.textContent = String(new Date().getFullYear());

    const seoTitle = get(data, "seo.title");
    if (seoTitle) document.title = seoTitle;
    else if (data.name) document.title = data.name;

    highlightToday(data);
  }

  async function load() {
    // Fallback updates that should run even if fetch fails.
    const year = document.querySelector("[data-year]");
    if (year) year.textContent = String(new Date().getFullYear());

    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      fillPage(data);
    } catch (err) {
      // HTML already contains good fallback content — log and move on.
      console.warn("[business] using fallback content:", err.message);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load, { once: true });
  } else {
    load();
  }
})();
