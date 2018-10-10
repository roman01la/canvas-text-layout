importScripts("./renderer.js");

this.onmessage = evt => {
  if (evt.data.type === "init") {
    const { dpr, width, height } = evt.data;
    updateEnv({ dpr, width, height });
    renderLoop();
  }
  if (evt.data.type === "update") {
    const { dpr, width, height } = evt.data;
    updateEnv({ dpr, width, height });
  }
};

function renderLoop() {
  requestAnimationFrame(() => renderLoop());
  const img = renderApp();
  this.postMessage({ type: "render", img }, [img]);
}

function renderApp() {
  render(
    { left: 0, top: 0, ...this.__env },
    view(
      {
        top: 0,
        left: 0,
        width: this.__env.width,
        height: this.__env.height
      },
      view(
        {
          top: 16,
          left: 16,
          width: "40%",
          style: {
            borderColor: "red"
          }
        },
        p(
          {},
          "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        )
      ),
      view(
        {
          top: 16,
          left: "45%",
          width: "25%",
          style: {
            borderColor: "red"
          }
        },
        p(
          {},
          "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        )
      )
    )
  );

  return this.canvas.transferToImageBitmap();
}
