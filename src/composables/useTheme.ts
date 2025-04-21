import { onMounted, ref, watch } from "vue";

export function useTheme() {
  const isDark = ref(false);

  const toggleDark = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle("dark", isDark.value);
  };

  onMounted(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    isDark.value = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", isDark.value);
  });

  watch(isDark, (val) => {
    localStorage.setItem("theme", val ? "dark" : "light");
  });

  return {
    isDark,
    toggleDark,
  };
}
