// sat-compress.js — drives the homepage compression wipe + level slider.
(function () {
  const BASE = "assets/sat-compress/";
  const stage = document.getElementById("compress-stage");
  if (!stage) return;
  const orig = document.getElementById("compress-orig");
  const recon = document.getElementById("compress-recon");
  const clip = document.getElementById("compress-recon-clip");
  const handle = document.getElementById("compress-handle");
  const slider = document.getElementById("compress-slider");
  const readout = document.getElementById("compress-readout");

  let levels = [];

  function lamName(lam) {
    // 0.5 -> "lambda-0.5", 40 -> "lambda-40"
    return "lambda-" + (Number.isInteger(lam) ? String(lam) : String(lam));
  }

  function fmtBytes(b) {
    return b < 1024 ? b + " B" : (b / 1024).toFixed(1) + " KB";
  }

  function setLevel(i) {
    const lv = levels[i];
    if (!lv) return;
    recon.src = BASE + "level_" + lamName(lv.lambda) + ".png";
    readout.textContent =
      lv.ratio.toFixed(0) + "× smaller · " + fmtBytes(lv.bytes) +
      " · " + lv.psnr.toFixed(1) + " dB PSNR · λ=" + lv.lambda;
  }

  function setWipe(frac) {
    const pct = Math.max(0, Math.min(1, frac)) * 100;
    // reconstruction fills the stage; reveal it from the right of the handle
    clip.style.clipPath = "inset(0 0 0 " + pct + "%)";
    handle.style.left = pct + "%";
  }

  function pointerWipe(ev) {
    const rect = stage.getBoundingClientRect();
    const x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - rect.left;
    setWipe(x / rect.width);
  }

  let dragging = false;
  stage.addEventListener("mousedown", (e) => { dragging = true; pointerWipe(e); });
  window.addEventListener("mousemove", (e) => { if (dragging) pointerWipe(e); });
  window.addEventListener("mouseup", () => { dragging = false; });
  stage.addEventListener("touchstart", (e) => { dragging = true; pointerWipe(e); }, { passive: true });
  window.addEventListener("touchmove", (e) => { if (dragging) pointerWipe(e); }, { passive: true });
  window.addEventListener("touchend", () => { dragging = false; });

  slider.addEventListener("input", () => setLevel(parseInt(slider.value, 10)));

  fetch(BASE + "manifest.json")
    .then((r) => r.json())
    .then((m) => {
      levels = m.levels;
      slider.max = String(levels.length - 1);
      orig.src = BASE + "original.png";
      slider.value = String(levels.length - 1); // start at highest quality
      setLevel(levels.length - 1);
      setWipe(0.5);
    })
    .catch((e) => { readout.textContent = "failed to load demo: " + e; });
})();
