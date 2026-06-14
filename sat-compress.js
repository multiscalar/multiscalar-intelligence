// sat-compress.js — drives the homepage compression-level slider.
// Left = least compression (original) -> right = most compression (highest ratio).
(function () {
  const BASE = "assets/sat-compress/";
  const recon = document.getElementById("compress-recon");
  if (!recon) return;
  const slider = document.getElementById("compress-slider");
  const ratioEl = document.getElementById("compress-ratio");
  const metaEl = document.getElementById("compress-meta");

  let stops = [];

  function lamName(lam) {
    return "lambda-" + String(lam);
  }

  function fmtBytes(b) {
    if (b >= 1048576) return (b / 1048576).toFixed(1) + " MB";
    if (b >= 1024) return (b / 1024).toFixed(1) + " KB";
    return b + " B";
  }

  function setStop(i) {
    const s = stops[i];
    if (!s) return;
    recon.src = BASE + s.img;
    ratioEl.textContent = s.label;
    metaEl.textContent = s.size;
  }

  slider.addEventListener("input", () => setStop(parseInt(slider.value, 10)));

  fetch(BASE + "manifest.json")
    .then((r) => r.json())
    .then((m) => {
      const asc = m.levels.slice().sort((a, b) => a.ratio - b.ratio); // 55× … 142×
      stops = [{ img: "original.png", label: "Original", size: fmtBytes(m.original_bytes) }];
      asc.forEach((lv) => stops.push({
        img: "level_" + lamName(lv.lambda) + ".png",
        label: lv.ratio.toFixed(0) + "× smaller",
        size: fmtBytes(lv.bytes),
      }));
      slider.max = String(stops.length - 1);
      slider.value = "0"; // start on the original (no compression)
      setStop(0);
    })
    .catch((e) => { metaEl.textContent = "failed to load demo: " + e; });
})();
