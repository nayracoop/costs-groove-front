import {defineNuxtPlugin, useRuntimeConfig, useState} from "#app";
import {ref} from "vue";

const DEFAULT_THEME = {
  bg: "#f4ecdd", // cream - layout background
  fg: "#21241e", // charcoal
  surface: "#b1bca2", // sage - card background (contrasts with cream layout)
  border: "#9d9ea2", // stone
  muted: "#6e634a", // olive (muted text)
  accent: "#402210", // cocoa
  info: "#6e634a",
  success: "#b1bca2", // sage
  warning: "#9d9ea2", // stone
  error: "#402210"
};

function applyTheme(themeVars) {
  const el = document.documentElement;
  Object.entries(themeVars).forEach(([k, v]) => {
    el.style.setProperty(`--nyr-${k}`, v);
  });
}

export default defineNuxtPlugin((nuxtApp) => {
  const cfg = useRuntimeConfig();
  const opts = (cfg && cfg.public && cfg.public.nyr) || {};
  const themeVars = {...DEFAULT_THEME, ...(opts.theme || {})};

  // Apply theme immediately on client
  if (process.client) {
    applyTheme(themeVars);
  }

  const prefs = useState("nyr:prefs", () => {
    let saved = null;
    if (process.client) {
      try { saved = JSON.parse(localStorage.getItem("nyr:prefs") || "null"); } catch {}
    }
    return {numberRounding: 2, ...(opts.preferences || {}), ...(saved || {})};
  });
  const perms = useState("nyr:perms", () => { return (opts.permissions || {}); });
  const theme = useState("nyr:theme", () => { return "default"; });

  if (process.client) {
    applyTheme(themeVars);
    document.documentElement.setAttribute("data-nyr-theme", theme.value);
  }

  const setPrefs = (next) => {
    prefs.value = {...prefs.value, ...next};
    if (process.client) {
      try { localStorage.setItem("nyr:prefs", JSON.stringify(prefs.value)); } catch {}
    }
  };

  const setTheme = (name) => {
    theme.value = name;
    if (process.client) {
      document.documentElement.setAttribute("data-nyr-theme", name);
    }
  };

  const createSSE = (channel) => {
    const base = (opts.sse && opts.sse.baseURL) || null;
    const url = base ? `${base.replace(/\/$/, "")}/${String(channel).replace(/^\//, "")}` : channel;
    const data = ref(null);
    let source;
    if (process.client) {
      source = new EventSource(url);
      source.onmessage = (ev) => {
        try { data.value = JSON.parse(ev.data); } catch { data.value = ev.data; }
      };
    }
    const close = () => { if (source) source.close(); };
    return {data, close};
  };

  return {
    provide: {
      nyr: {
        prefs,
        perms,
        theme,
        setPrefs,
        setTheme,
        createSSE
      }
    }
  };
});
