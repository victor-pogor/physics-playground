import { onMount } from "solid-js";

export const VectorsComponent = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    const ctx = canvasRef?.getContext("2d");
    if (ctx) {
      // Clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Draw a simple vector (arrow)
      ctx.beginPath();
      ctx.moveTo(50, 100); // Start point
      ctx.lineTo(200, 100); // End point
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw arrowhead
      ctx.beginPath();
      ctx.moveTo(200, 100);
      ctx.lineTo(190, 95);
      ctx.lineTo(190, 105);
      ctx.closePath();
      ctx.fillStyle = "blue";
      ctx.fill();
    }
  });

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={200}
      style={{ border: "1px solid #ccc" }}
    />
  );
};
