// sat-compress.js — drives the homepage compression-level slider.
(function () {
  const BASE = "assets/sat-compress/";
  const recon = document.getElementById("compress-recon");
  if (!recon) return;
  const slider = document.getElementById("compress-slider");
  const ratioEl = document.getElementById("compress-ratio");
  const metaEl = document.getElementById("compress-meta");

  let levels = [];

  function lamName(lam) {
    // numeric manifest value -> checkpoint filename suffix (40 -> "40", 0.5 -> "0.5")
    return "lambda-" + (Number.isInteger(lam) ? String(lam) : String(lam));
  }

  function fmtBytes(b) {
    return b < 1024 ? b + " B" : (b / 1024).toFixed(1) + " KB";
  }

  function setLevel(i) {
    const lv = levels[i];
    if (!lv) return;
    recon.src = BASE + "level_" + lamName(lv.lambda) + ".png";
    ratioEl.textContent = lv.ratio.toFixed(0) + "× smaller";
    metaEl.textContent =
      fmtBytes(lv.bytes) + " · " + lv.psnr.toFixed(1) + " dB PSNR · " +
      lv.bpppb.toFixed(3) + " bpppb";
  }

  slider.addEventListener("input", () => setLevel(parseInt(slider.value, 10)));

  fetch(BASE + "manifest.json")
    .then((r) => r.json())
    .then((m) => {
      levels = m.levels;
      slider.max = String(levels.length - 1);
      slider.value = "0"; // start at the highest compression ratio (all levels are visually lossless)
      setLevel(0);
    })
    .catch((e) => { metaEl.textContent = "failed to load demo: " + e; });
})();
