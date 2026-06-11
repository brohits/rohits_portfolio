import { useEffect } from "react";

const THEME_PALETTE = {
  light: {
    base: [255, 255, 255],
    accentSoft: [212, 232, 224],
    accent: [45, 106, 90],
    glowBlue: [106, 159, 196],
    glowOrange: [212, 146, 92],
  },
  dark: {
    base: [26, 24, 22],
    accentSoft: [42, 61, 53],
    accent: [109, 184, 154],
    glowBlue: [90, 143, 173],
    glowOrange: [196, 132, 88],
  },
};

const RADIAL_WASHES = {
  "recent-roles": [
    { x: 0.12, y: 0.1, rgb: [45, 106, 90], strength: 0.14 },
    { x: 0.28, y: 0.22, rgb: [212, 146, 92], strength: 0.09 },
    { x: 0.05, y: 0.35, rgb: [106, 159, 196], strength: 0.1 },
    { x: 0.88, y: 0.92, rgb: [45, 106, 90], strength: 0.14 },
    { x: 0.72, y: 0.78, rgb: [212, 146, 92], strength: 0.09 },
    { x: 0.95, y: 0.65, rgb: [106, 159, 196], strength: 0.1 },
  ],
  hero: [
    { x: 0.12, y: 0.1, rgb: [45, 106, 90], strength: 0.12 },
    { x: 0.28, y: 0.22, rgb: [212, 146, 92], strength: 0.08 },
    { x: 0.05, y: 0.35, rgb: [106, 159, 196], strength: 0.09 },
  ],
};

function getTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

function relativeLuminance([r, g, b]) {
  const channel = (value) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return (
    0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
  );
}

function blendRgb(base, overlay, amount) {
  const mix = Math.min(1, Math.max(0, amount));
  return base.map((value, index) =>
    Math.round(value * (1 - mix) + overlay[index] * mix)
  );
}

function estimateRgbAtPoint(x, y, section, theme) {
  const palette = THEME_PALETTE[theme];
  let rgb = [...palette.base];
  const sectionRect = section.getBoundingClientRect();

  const washKey = section.classList.contains("recent-roles")
    ? "recent-roles"
    : section.classList.contains("hero")
      ? "hero"
      : null;

  if (!washKey) return rgb;

  const washes = RADIAL_WASHES[washKey].map((wash) => ({
    ...wash,
    rgb:
      theme === "dark"
        ? wash.rgb.map((value) => Math.round(value * 0.72))
        : wash.rgb,
  }));

  for (const wash of washes) {
    const cx = sectionRect.left + sectionRect.width * wash.x;
    const cy = sectionRect.top + sectionRect.height * wash.y;
    const radius = Math.max(sectionRect.width, sectionRect.height) * 0.42;
    const distance = Math.hypot(x - cx, y - cy);
    if (distance < radius) {
      const falloff = 1 - distance / radius;
      rgb = blendRgb(rgb, wash.rgb, wash.strength * falloff * falloff);
    }
  }

  return rgb;
}

function toneFromLuminance(luminance) {
  return luminance > 0.56 ? "on-light" : "on-dark";
}

function updateSectionContrast(section, probeSelectors) {
  if (!section) return;

  const theme = getTheme();
  const probes = probeSelectors.flatMap((selector) =>
    Array.from(section.querySelectorAll(selector))
  );

  if (!probes.length) return;

  const luminances = probes.map((probe) => {
    const rect = probe.getBoundingClientRect();
    const x = rect.left + rect.width * 0.2;
    const y = rect.top + rect.height * 0.35;
    return relativeLuminance(estimateRgbAtPoint(x, y, section, theme));
  });

  const average =
    luminances.reduce((sum, value) => sum + value, 0) / luminances.length;
  const tone = toneFromLuminance(average);

  if (section.dataset.adaptiveTone !== tone) {
    section.dataset.adaptiveTone = tone;
  }
}

export function useAdaptiveContrast(sectionRef, options = {}) {
  const probeSelectors = options.probeSelectors ?? [".adaptive-probe"];
  const probeKey = probeSelectors.join(",");

  useEffect(() => {
    const section = sectionRef.current;
    const selectors = probeKey.split(",").filter(Boolean);
    if (!section) return;

    let visible = false;
    let resizeTimer = 0;

    const runUpdate = () => {
      if (!visible) return;
      updateSectionContrast(section, selectors);
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        section.dataset.inView = visible ? "true" : "false";
        if (visible) {
          runUpdate();
        }
      },
      { rootMargin: "80px 0px", threshold: 0 }
    );

    visibilityObserver.observe(section);
    runUpdate();

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(runUpdate, 150);
    };

    window.addEventListener("resize", handleResize);

    const themeObserver = new MutationObserver(runUpdate);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      themeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [sectionRef, probeKey]);
}
