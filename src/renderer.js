const canvas = new OffscreenCanvas(0, 0);
const ctx = canvas.getContext("2d");

this.canvas = canvas;

let devicePixelRatio;

function updateEnv({ dpr, width, height }) {
  this.__env = {
    dpr,
    width,
    height
  };
  devicePixelRatio = dpr;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
}

function wrapText({ text, breakWord, maxWidth, lineHeight, font, x, y }) {
  ctx.font = font;

  const words = breakWord === "all" ? text.split("") : text.split(" ");
  const j = breakWord === "all" ? "" : " ";
  const wln = words.length;
  const lines = [];
  let line = "";

  for (let n = 0; n < wln; n++) {
    const eol = n === wln - 1 ? "" : j;
    const testLine = line + words[n] + eol;
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth <= maxWidth) {
      line = testLine;
    } else {
      y += lineHeight;
      lines.push([x, y, line]);
      line = "";
      n--;
    }
  }

  if (line) {
    lines.push([x, y + lineHeight, line]);
  }

  const height = lines[lines.length - 2][1];

  return { lines, font, height };
}

function makeFontProp({
  fontStyle = "normal",
  fontWeight = "normal",
  fontSize = 16,
  lineHeight = 16,
  fontFamily = "Helvetica"
}) {
  const dpr = devicePixelRatio;
  return [
    fontStyle,
    fontWeight,
    `${fontSize * dpr}px/${lineHeight * dpr}px`,
    fontFamily
  ].join(" ");
}

function renderView(
  opts,
  { children, top = 0, left = 0, height = 0, width = 0, style = {} }
) {
  const dpr = devicePixelRatio;

  const w =
    typeof width === "string" ? (parseInt(width) / 100) * opts.width : width;
  const l =
    typeof left === "string" ? (parseInt(left) / 100) * opts.width : left;

  const childHeight = children.reduce((ret, node) => {
    const childNode =
      node[Symbol.for("ui/type")] === "text"
        ? {
            ...node,
            left: l,
            top,
            maxWidth: w * dpr
          }
        : {
            ...node,
            maxWidth: w * dpr
          };

    const { height } = render(opts, childNode);

    return height > ret ? height : ret;
  }, 0);

  const viewHeight = childHeight > height ? childHeight : height;

  if (style.borderColor) {
    ctx.strokeStyle = style.borderColor;
    ctx.lineWidth = 1 * dpr;
    ctx.strokeRect(l * dpr, top * dpr, w * dpr, viewHeight);
  }

  return {
    height: viewHeight
  };
}

function renderText(opts, node) {
  const {
    text,
    maxWidth,
    lineHeight,
    color = "#000",
    left = 0,
    top = 0
  } = node;
  const dpr = devicePixelRatio;

  const { lines, font, height } = wrapText({
    text,
    maxWidth,
    lineHeight: lineHeight * dpr,
    font: makeFontProp(node),
    x: left * dpr,
    y: top * dpr,
    breakWord: "word"
  });

  ctx.font = font;
  ctx.fillStyle = color;

  lines.forEach(([x, y, text]) => {
    ctx.fillText(text, x, y);
  });

  return {
    height
  };
}

function render(opts, node) {
  if (node[Symbol.for("ui/type")] === "view") {
    return renderView(opts, node);
  }
  if (node[Symbol.for("ui/type")] === "text") {
    return renderText(opts, node);
  }
}

const view = (opts, ...children) => ({
  [Symbol.for("ui/type")]: "view",
  ...opts,
  children
});

const h1 = (opts, text) => ({
  [Symbol.for("ui/type")]: "text",
  text,
  fontSize: 18,
  lineHeight: 20,
  fontWeight: 600,
  ...opts
});

const p = (opts, text) => ({
  [Symbol.for("ui/type")]: "text",
  text,
  fontSize: 14,
  lineHeight: 16,
  ...opts
});
