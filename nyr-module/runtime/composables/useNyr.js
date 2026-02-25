import {useNuxtApp, useState} from "#app";

export const useNyr = () => {
  const nuxtApp = useNuxtApp();
  const prefs = useState("nyr:prefs");
  const perms = useState("nyr:perms");
  const theme = useState("nyr:theme");

  const setPrefs = (next) => {
    prefs.value = {...prefs.value, ...next};
    try { localStorage.setItem("nyr:prefs", JSON.stringify(prefs.value)); } catch {}
  };

  const setTheme = (name) => {
    theme.value = name;
    document.documentElement.setAttribute("data-nyr-theme", name);
  };

  return {prefs, perms, theme, setPrefs, setTheme, nyr: nuxtApp.$nyr};
};
