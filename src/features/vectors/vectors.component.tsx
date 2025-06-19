import { onMount } from "solid-js";
import gridVertWGSL from '../../shaders/grid.vert.wgsl';
import gridFragWGSL from '../../shaders/grid.frag.wgsl';
import { quitIfWebGPUNotAvailable } from '../util';

export const VectorsComponent = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(async () => {
    if (!canvasRef) return;
    // --- WebGPU Setup ---
    const webgpu = await initWebGPU(canvasRef);
    if (!webgpu) return;
    const { device, context, presentationFormat } = webgpu;

    // --- Pipeline ---
    const pipeline = createGridPipeline(device, presentationFormat, gridVertWGSL, gridFragWGSL);

    // --- Vertex Data & Buffer ---
    const gridSize = 10;
    const gridSpacing = 0.1;
    const vertexData = generateGridVertices(gridSize, gridSpacing);
    const vertexBuffer = createVertexBuffer(device, vertexData);

    // --- Bind Group ---
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [],
    });

    // --- Render Frame ---
    renderFrame(device, context, pipeline, vertexBuffer, bindGroup, vertexData);
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

// Helper: Generate grid vertices
function generateGridVertices(gridSize: number, gridSpacing: number): Float32Array {
  const gridVertices: number[] = [];
  for (let i = -gridSize; i <= gridSize; i++) {
    const val = i * gridSpacing;
    // Horizontal line
    gridVertices.push(-1, val, 1, val);
    // Vertical line
    gridVertices.push(val, -1, val, 1);
  }
  return new Float32Array(gridVertices);
}

// Helper: Create render pipeline
function createGridPipeline(device: GPUDevice, presentationFormat: GPUTextureFormat, gridVertWGSL: string, gridFragWGSL: string): GPURenderPipeline {
  return device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({ code: gridVertWGSL }),
      buffers: [
        {
          arrayStride: 2 * 4,
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x2" },
          ],
        },
      ],
    },
    fragment: {
      module: device.createShaderModule({ code: gridFragWGSL }),
      targets: [{ format: presentationFormat }],
    },
    primitive: { topology: 'line-list' },
  });
}

// Helper: Create vertex buffer
function createVertexBuffer(device: GPUDevice, vertexData: Float32Array): GPUBuffer {
  const buffer = device.createBuffer({
    size: vertexData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buffer, 0, vertexData);
  return buffer;
}

// Helper: Render a frame
function renderFrame(
  device: GPUDevice,
  context: GPUCanvasContext,
  pipeline: GPURenderPipeline,
  vertexBuffer: GPUBuffer,
  bindGroup: GPUBindGroup,
  vertexData: Float32Array
) {
  const commandEncoder = device.createCommandEncoder();
  const swapChainTexture = context.getCurrentTexture();
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
  passEncoder.draw(vertexData.length / 2, 1, 0, 0);
  passEncoder.end();
  device.queue.submit([commandEncoder.finish()]);
}

// Helper: Initialize WebGPU device and context
async function initWebGPU(canvas: HTMLCanvasElement) {
  const adapter = await navigator.gpu?.requestAdapter({ featureLevel: 'compatibility' });
  const device = await adapter?.requestDevice();
  quitIfWebGPUNotAvailable(adapter, device);
  const context = canvas.getContext('webgpu') as GPUCanvasContext;

  const devicePixelRatio = window.devicePixelRatio;
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;

  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format: presentationFormat });

  return { device, context, presentationFormat };
}




