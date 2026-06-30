export function getThemeInitScript() {
  return `
    (function() {
      try {
        var theme = localStorage.getItem('nestrova-theme') || 'system';
        var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var resolved = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
        document.documentElement.classList.toggle('dark', resolved === 'dark');
      } catch (e) {}
    })();
  `;
}
