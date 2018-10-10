const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const getWindowSize = () => ({
  w: window.innerWidth * window.devicePixelRatio,
  h: window.innerHeight * window.devicePixelRatio
});

let { w, h } = getWindowSize();

Object.assign(canvas.style, {
  position: "absolute",
  top: 0,
  left: 0,
  transformOrigin: "0 0",
  transform: `scale(${1 / window.devicePixelRatio})`
});

canvas.width = w;
canvas.height = h;

const worker = new Worker("/src/app.js");

worker.addEventListener("message", evt => {
  if (evt.data.type === "render") {
    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(evt.data.img, 0, 0);
  }
});

worker.postMessage({
  type: "init",
  dpr: window.devicePixelRatio,
  width: w / window.devicePixelRatio,
  height: h / window.devicePixelRatio
});

let rid;

window.addEventListener(
  "resize",
  function() {
    if (rid) {
      cancelAnimationFrame(rid);
      id = null;
    }
    rid = requestAnimationFrame(() => {
      const ws = getWindowSize();
      w = ws.w;
      h = ws.h;

      worker.postMessage({
        type: "update",
        dpr: window.devicePixelRatio,
        width: w / window.devicePixelRatio,
        height: h / window.devicePixelRatio
      });
    });
  },
  false
);
