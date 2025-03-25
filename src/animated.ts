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
// The goal here is to have a range of frequencies far enough apart that they
// fall in and out of phase.
const frequencies = Array.from({ length: NUM_PARAMS }, (_, i) => {
  const t = i / (NUM_PARAMS - 1);
  return SLOWEST_FREQ + (FASTEST_FREQ - SLOWEST_FREQ) * t;
});

frequencies[7] = 0.001; // Change numScallops much less often because it's jarring

function calculateAnimatedValue(
  min: number,
  max: number,
  frequency: number,
  time: number,
  shouldRound: boolean = false
): number {
  const value =
    min + (max - min) * (0.5 + 0.5 * Math.sin(2 * Math.PI * frequency * time));
  return shouldRound ? Math.round(value) : value;
}

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
        eccentricity: calculateAnimatedValue(
          ranges.firstEcc.min,
          ranges.firstEcc.max,
          frequencies[0],
          time
        ),
        width: calculateAnimatedValue(
          ranges.firstWidth.min,
          ranges.firstWidth.max,
          frequencies[1],
          time,
          true
        ),
        height: calculateAnimatedValue(
          ranges.firstHeight.min,
          ranges.firstHeight.max,
          frequencies[2],
          time,
          true
        ),
      },
      secondPetals: {
        eccentricity: calculateAnimatedValue(
          ranges.secondEcc.min,
          ranges.secondEcc.max,
          frequencies[3],
          time
        ),
        width: calculateAnimatedValue(
          ranges.secondWidth.min,
          ranges.secondWidth.max,
          frequencies[4],
          time,
          true
        ),
        height: calculateAnimatedValue(
          ranges.secondHeight.min,
          ranges.secondHeight.max,
          frequencies[5],
          time,
          true
        ),
      },
      circleRadius: calculateAnimatedValue(
        ranges.circleRadius.min,
        ranges.circleRadius.max,
        frequencies[6],
        time,
        true
      ),
      numScallops: calculateAnimatedValue(
        ranges.numScallops.min,
        ranges.numScallops.max,
        frequencies[7],
        time,
        true
      ),
      scallopDepth: calculateAnimatedValue(
        ranges.scallopDepth.min,
        ranges.scallopDepth.max,
        frequencies[8],
        time
      ),
      hexagonRadius: calculateAnimatedValue(
        ranges.hexagonRadius.min,
        ranges.hexagonRadius.max,
        frequencies[9],
        time,
        true
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
