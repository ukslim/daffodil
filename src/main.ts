import "./style.css";
import { DaffodilParams, generateDaffodil } from "./svg-generator";

const defaultParams: DaffodilParams = {
  firstPetals: {
    eccentricity: 1.4,
    width: 150,
    height: 230,
  },
  secondPetals: {
    eccentricity: 1.4,
    width: 136,
    height: 272,
  },
  circleRadius: 80,
  numScallops: 22,
  scallopDepth: 0.11,
  hexagonRadius: 22,
};

function saveParams(params: DaffodilParams) {
  localStorage.setItem("daffodilParams", JSON.stringify(params));
}

function loadParams(): DaffodilParams {
  const saved = localStorage.getItem("daffodilParams");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load saved parameters, using defaults");
    }
  }
  return defaultParams;
}

function setSliderValue(id: string, value: number) {
  const slider = document.getElementById(id) as HTMLInputElement;
  if (value && slider) {
    slider.value = value.toString();
  }
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="page-header">
    <h1>Daffodil editor</h1>
    <div class="description">I vibe-coded this to fine-tune an image which I would later turn into a lino print with some hand-carved imprecision.</div>
  </div>
  <div class="container">
    <div class="controls">
      <h3>First Petals</h3>
      <div class="control-group">
        <label>Eccentricity: <span id="firstEccValue">1.8</span></label>
        <input type="range" id="firstEcc" min="1" max="3" step="0.1" value="1.8">
      </div>
      <div class="control-group">
        <label>Width: <span id="firstWidthValue">95</span></label>
        <input type="range" id="firstWidth" min="30" max="150" step="1" value="95">
      </div>
      <div class="control-group">
        <label>Height: <span id="firstHeightValue">220</span></label>
        <input type="range" id="firstHeight" min="100" max="300" step="1" value="220">
      </div>

      <h3>Second Petals</h3>
      <div class="control-group">
        <label>Eccentricity: <span id="secondEccValue">1.8</span></label>
        <input type="range" id="secondEcc" min="1" max="3" step="0.1" value="1.8">
      </div>
      <div class="control-group">
        <label>Width: <span id="secondWidthValue">45</span></label>
        <input type="range" id="secondWidth" min="20" max="150" step="1" value="45">
      </div>
      <div class="control-group">
        <label>Height: <span id="secondHeightValue">180</span></label>
        <input type="range" id="secondHeight" min="100" max="300" step="1" value="180">
      </div>

      <h3>Center</h3>
      <div class="control-group">
        <label>Circle Radius: <span id="circleRadiusValue">50</span></label>
        <input type="range" id="circleRadius" min="20" max="100" step="1" value="50">
      </div>
      <div class="control-group">
        <label>Number of Scallops: <span id="numScallopsValue">12</span></label>
        <input type="range" id="numScallops" min="6" max="24" step="1" value="12">
      </div>
      <div class="control-group">
        <label>Scallop Depth: <span id="scallopDepthValue">0.15</span></label>
        <input type="range" id="scallopDepth" min="0.05" max="0.3" step="0.01" value="0.15">
      </div>
      <div class="control-group">
        <label>Hexagon Radius: <span id="hexagonRadiusValue">30</span></label>
        <input type="range" id="hexagonRadius" min="10" max="60" step="1" value="30">
      </div>

      <div class="button-group">
        <button id="saveButton" class="save-button">Save as PNG</button>
        <button id="saveSvgButton" class="save-button">Save as SVG</button>
      </div>
    </div>
    <div id="daffodilContainer"></div>
  </div>
`;

const container = document.querySelector<HTMLDivElement>("#daffodilContainer")!;

function saveSvgAsPng() {
  const svg = container.querySelector("svg");
  if (!svg) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Set canvas size to match SVG
  canvas.width = 600;
  canvas.height = 600;

  // Create image from SVG
  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    // Trigger download
    const link = document.createElement("a");
    link.download = "daffodil.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  img.src = url;
}

function saveSvg() {
  const svg = container.querySelector("svg");
  if (!svg) return;

  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const link = document.createElement("a");
  link.download = "daffodil.svg";
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

// Add button event listeners
document.getElementById("saveButton")?.addEventListener("click", saveSvgAsPng);
document.getElementById("saveSvgButton")?.addEventListener("click", saveSvg);

function updateDaffodil() {
  const params: DaffodilParams = {
    firstPetals: {
      eccentricity: parseFloat(
        (document.getElementById("firstEcc") as HTMLInputElement).value
      ),
      width: parseInt(
        (document.getElementById("firstWidth") as HTMLInputElement).value
      ),
      height: parseInt(
        (document.getElementById("firstHeight") as HTMLInputElement).value
      ),
    },
    secondPetals: {
      eccentricity: parseFloat(
        (document.getElementById("secondEcc") as HTMLInputElement).value
      ),
      width: parseInt(
        (document.getElementById("secondWidth") as HTMLInputElement).value
      ),
      height: parseInt(
        (document.getElementById("secondHeight") as HTMLInputElement).value
      ),
    },
    circleRadius: parseInt(
      (document.getElementById("circleRadius") as HTMLInputElement).value
    ),
    numScallops: parseInt(
      (document.getElementById("numScallops") as HTMLInputElement).value
    ),
    scallopDepth: parseFloat(
      (document.getElementById("scallopDepth") as HTMLInputElement).value
    ),
    hexagonRadius: parseInt(
      (document.getElementById("hexagonRadius") as HTMLInputElement).value
    ),
  };

  // Update display values
  (document.getElementById("firstEccValue") as HTMLSpanElement).textContent =
    params.firstPetals.eccentricity.toFixed(1);
  (document.getElementById("firstWidthValue") as HTMLSpanElement).textContent =
    params.firstPetals.width.toString();
  (document.getElementById("firstHeightValue") as HTMLSpanElement).textContent =
    params.firstPetals.height.toString();
  (document.getElementById("secondEccValue") as HTMLSpanElement).textContent =
    params.secondPetals.eccentricity.toFixed(1);
  (document.getElementById("secondWidthValue") as HTMLSpanElement).textContent =
    params.secondPetals.width.toString();
  (
    document.getElementById("secondHeightValue") as HTMLSpanElement
  ).textContent = params.secondPetals.height.toString();
  (
    document.getElementById("circleRadiusValue") as HTMLSpanElement
  ).textContent = params.circleRadius.toString();
  (document.getElementById("numScallopsValue") as HTMLSpanElement).textContent =
    params.numScallops.toString();
  (
    document.getElementById("scallopDepthValue") as HTMLSpanElement
  ).textContent = params.scallopDepth.toFixed(2);
  (
    document.getElementById("hexagonRadiusValue") as HTMLSpanElement
  ).textContent = params.hexagonRadius.toString();

  // Save to localStorage
  saveParams(params);

  container.innerHTML = generateDaffodil(params);
}

// Load saved parameters and set slider values
const savedParams = loadParams();
setSliderValue("firstEcc", savedParams.firstPetals.eccentricity);
setSliderValue("firstWidth", savedParams.firstPetals.width);
setSliderValue("firstHeight", savedParams.firstPetals.height);
setSliderValue("secondEcc", savedParams.secondPetals.eccentricity);
setSliderValue("secondWidth", savedParams.secondPetals.width);
setSliderValue("secondHeight", savedParams.secondPetals.height);
setSliderValue("circleRadius", savedParams.circleRadius);
setSliderValue("numScallops", savedParams.numScallops);
setSliderValue("scallopDepth", savedParams.scallopDepth);
setSliderValue("hexagonRadius", savedParams.hexagonRadius);

// Add event listeners to all sliders
const sliders = document.querySelectorAll('input[type="range"]');
sliders.forEach((slider) => {
  slider.addEventListener("input", updateDaffodil);
});

// Initial render
updateDaffodil();
