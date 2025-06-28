export function setThemeColor(color) {
  let metaTheme = document.querySelector("meta[name=theme-color]");
  if (!metaTheme) {
    metaTheme = document.createElement("meta");
    metaTheme.name = "theme-color";
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute("content", color);
}

export function resetThemeColor() {
  setThemeColor("#ffffff");
}