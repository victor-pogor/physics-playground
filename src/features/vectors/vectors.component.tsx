import { onMount } from "solid-js";
import triangleVertWGSL from '../../shaders/triangle.vert.wgsl';
import redFragWGSL from '../../shaders/red.frag.wgsl';
import { quitIfWebGPUNotAvailable } from '../util';

export const VectorsComponent = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(async () => {
    if (!canvasRef) return;

    const adapter = await navigator.gpu?.requestAdapter({
      featureLevel: 'compatibility',
    });

    const device = await adapter?.requestDevice();
    if (!device) return;

    quitIfWebGPUNotAvailable(adapter, device);

    const context = canvasRef.getContext('webgpu') as GPUCanvasContext;

    const devicePixelRatio = window.devicePixelRatio;
    canvasRef.width = canvasRef.clientWidth * devicePixelRatio;
    canvasRef.height = canvasRef.clientHeight * devicePixelRatio;
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

    context.configure({
      device,
      format: presentationFormat,
    });

    const pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: device.createShaderModule({
          code: triangleVertWGSL,
        }),
      },
      fragment: {
        module: device.createShaderModule({
          code: redFragWGSL,
        }),
        targets: [
          {
            format: presentationFormat,
          },
        ],
      },
      primitive: {
        topology: 'triangle-list',
      },
    });

    const vertexData = new Float32Array([
      // Triangle vertices positions (x, y)
      0, 0,
      0, 1,
      1, 0,
    ]);

    const vertexBuffer = device.createBuffer({
      size: vertexData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(vertexBuffer, 0, vertexData);

    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [],
    });

    function frame() {
      if (!device) return;
      const commandEncoder = device.createCommandEncoder();
      // Get the current texture from the swap chain
      const swapChainTexture = context.getCurrentTexture();
      // Create the render pass descriptor with the correct view
      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
          {
            view: swapChainTexture.createView(),
            loadOp: 'clear',
            clearValue: [0, 0, 0, 1],
            storeOp: 'store',
          },
        ],
      };
      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      passEncoder.setPipeline(pipeline);
      passEncoder.setVertexBuffer(0, vertexBuffer);
      passEncoder.setBindGroup(0, bindGroup);
      passEncoder.draw(3, 1, 0, 0);
      passEncoder.end();
      device.queue.submit([commandEncoder.finish()]);
    }

    // Initial call to start the rendering loop
    frame();
    // Optionally, you can use requestAnimationFrame to control the frame rate
    // const animate = () => {
    //   frame();
    //   requestAnimationFrame(animate);
    // };
    // requestAnimationFrame(animate);
  });

  return (
    <div style={{ width: "90vh", height: "90vh" }}>
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid #ccc", width: "100%", height: "100%" }}
      />
    </div>
  );
};
