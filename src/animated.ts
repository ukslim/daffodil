import "./style.css";
import { DaffodilParams, generateDaffodil } from "./svg-generator";

// Animation parameters
const SLOWEST_FREQ = 0.05; // Hz (0.2 / 4)
const FASTEST_FREQ = 0.075; // Hz (0.3 / 4)
const NUM_PARAMS = 10;

// Parameter ranges
const ranges = {
  firstEcc: { min: 1, max: 3 },
  firstWidth: { min: 30, max: 150 },
  firstHeight: { min: 100, max: 300 },
  secondEcc: { min: 1, max: 3 },
  secondWidth: { min: 20, max: 150 },
  secondHeight: { min: 100, max: 300 },
  circleRadius: { min: 20, max: 100 },
  numScallops: { min: 6, max: 24 },
  scallopDepth: { min: 0.05, max: 0.3 },
  hexagonRadius: { min: 10, max: 60 },
};

// Generate frequencies for each parameter
const frequencies = Array.from({ length: NUM_PARAMS }, (_, i) => {
  const t = i / (NUM_PARAMS - 1);
  return SLOWEST_FREQ + (FASTEST_FREQ - SLOWEST_FREQ) * t;
});

frequencies[7] = 0.001; // Change numScallops much less often

export function initAnimatedView() {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div class="page-header">
      <a href="/daffodil/" class="view-link">Back to editor</a>
    </div>
    <div class="container">
      <div id="daffodilContainer"></div>
    </div>
  `;

  const container = document.getElementById("daffodilContainer")!;

  function updateDaffodil(time: number) {
    const params: DaffodilParams = {
      firstPetals: {
        eccentricity:
          ranges.firstEcc.min +
          (ranges.firstEcc.max - ranges.firstEcc.min) *
            (0.5 + 0.5 * Math.sin(2 * Math.PI * frequencies[0] * time)),
        width: Math.round(
          ranges.firstWidth.min +
            (ranges.firstWidth.max - ranges.firstWidth.min) *
              (0.5 + 0.5 * Math.sin(2 * Math.PI * frequencies[1] * time))
        ),
        height: Math.round(
          ranges.firstHeight.min +
            (ranges.firstHeight.max - ranges.firstHeight.min) *
              (0.5 + 0.5 * Math.sin(2 * Math.PI * frequencies[2] * time))
        ),
      },
      secondPetals: {
        eccentricity:
          ranges.secondEcc.min +
          (ranges.secondEcc.max - ranges.secondEcc.min) *
            (0.5 + 0.5 * Math.sin(2 * Math.PI * frequencies[3] * time)),
        width: Math.round(
          ranges.secondWidth.min +
            (ranges.secondWidth.max - ranges.secondWidth.min) *
              (0.5 + 0.5 * Math.sin(2 * Math.PI * frequencies[4] * time))
        ),
        height: Math.round(
          ranges.secondHeight.min +
            (ranges.secondHeight.max - ranges.secondHeight.min) *
              (0.5 + 0.5 * Math.sin(2 * Math.PI * frequencies[5] * time))
        ),
      },
      circleRadius: Math.round(
        ranges.circleRadius.min +
          (ranges.circleRadius.max - ranges.circleRadius.min) *
            (0.5 + 0.5 * Math.sin(2 * Math.PI * frequencies[6] * time))
      ),
      numScallops: Math.round(
        ranges.numScallops.min +
          (ranges.numScallops.max - ranges.numScallops.min) *
            (0.5 + 0.5 * Math.sin(2 * Math.PI * frequencies[7] * time))
      ),
      scallopDepth:
        ranges.scallopDepth.min +
        (ranges.scallopDepth.max - ranges.scallopDepth.min) *
          (0.5 + 0.5 * Math.sin(2 * Math.PI * frequencies[8] * time)),
      hexagonRadius: Math.round(
        ranges.hexagonRadius.min +
          (ranges.hexagonRadius.max - ranges.hexagonRadius.min) *
            (0.5 + 0.5 * Math.sin(2 * Math.PI * frequencies[9] * time))
      ),
    };

    container.innerHTML = generateDaffodil(params);
  }

  // Animation loop
  const startTime = performance.now();
  function animate() {
    const currentTime = (performance.now() - startTime) / 1000; // Convert to seconds
    updateDaffodil(currentTime);
    requestAnimationFrame(animate);
  }

  // Start animation
  animate();
}
