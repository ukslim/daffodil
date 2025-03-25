// SVG dimensions and center point
const width = 600;
const height = 600;
const centerX = width / 2;
const centerY = height / 2;

function generateSuperellipsePath(
  x: number,
  y: number,
  width: number,
  height: number,
  eccentricity: number,
  rotation: number
): string {
  const points: { x: number; y: number }[] = [];
  const steps = 100;

  // Calculate the tip point (where we want to rotate around)
  const tipX = x;
  const tipY = y - height / 2;

  for (let i = 0; i <= steps; i++) {
    const t = (2 * Math.PI * i) / steps;
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);

    // Calculate point relative to center
    const px =
      (width / 2) *
      Math.pow(Math.abs(cosT), 2 / eccentricity) *
      Math.sign(cosT);
    const py =
      (height / 2) *
      Math.pow(Math.abs(sinT), 2 / eccentricity) *
      Math.sign(sinT);

    // Rotate point
    const rotatedX = px * Math.cos(rotation) - py * Math.sin(rotation);
    const rotatedY = px * Math.sin(rotation) + py * Math.cos(rotation);

    // Translate point relative to tip
    points.push({
      x: tipX + rotatedX,
      y: tipY + rotatedY + height / 2,
    });
  }

  return (
    `M ${points[0].x} ${points[0].y} ` +
    points.map((p) => `L ${p.x} ${p.y}`).join(" ")
  );
}

function generateScallopedCircle(
  centerX: number,
  centerY: number,
  radius: number,
  numScallops: number = 12,
  scallopDepth: number = 0.15
): string {
  const scallops: string[] = [];
  const scallop_depth = radius * scallopDepth;

  for (let i = 0; i < numScallops; i++) {
    const startAngle = (i * 2 * Math.PI) / numScallops;
    const endAngle = ((i + 1) * 2 * Math.PI) / numScallops;
    const midAngle = (startAngle + endAngle) / 2;

    const startX = centerX + radius * Math.cos(startAngle);
    const startY = centerY + radius * Math.sin(startAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);
    const controlX = centerX + (radius - scallop_depth) * Math.cos(midAngle);
    const controlY = centerY + (radius - scallop_depth) * Math.sin(midAngle);

    if (i === 0) {
      scallops.push(`M ${startX} ${startY}`);
    }
    scallops.push(`Q ${controlX} ${controlY} ${endX} ${endY}`);
  }

  return scallops.join(" ");
}

export interface DaffodilParams {
  firstPetals: {
    eccentricity: number;
    width: number;
    height: number;
  };
  secondPetals: {
    eccentricity: number;
    width: number;
    height: number;
  };
  circleRadius: number;
  numScallops: number;
  scallopDepth: number;
  hexagonRadius: number;
}

export function generateDaffodil(params: DaffodilParams) {
  let svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
      <feOffset dx="1" dy="1"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.3"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <g filter="url(#shadow)">`;

  // Draw first set of three petals (wider)
  for (let i = 0; i < 3; i++) {
    const angle = (2 * Math.PI * i) / 3 + Math.PI / 3;
    const rotationPoint = {
      x: centerX + 100 * Math.sin(angle),
      y: centerY - 100 * Math.cos(angle),
    };
    const path = generateSuperellipsePath(
      rotationPoint.x,
      rotationPoint.y,
      params.firstPetals.width,
      params.firstPetals.height,
      params.firstPetals.eccentricity,
      angle
    );
    svgContent += `
    <path d="${path}" fill="yellow" stroke="#2F4F4F" stroke-width="4"/>`;
  }

  // Draw second set of three petals (narrower, offset by 60 degrees)
  for (let i = 0; i < 3; i++) {
    const angle = (2 * Math.PI * i) / 3;
    const rotationPoint = {
      x: centerX + 90 * Math.sin(angle),
      y: centerY - 90 * Math.cos(angle),
    };
    const path = generateSuperellipsePath(
      rotationPoint.x,
      rotationPoint.y,
      params.secondPetals.width,
      params.secondPetals.height,
      params.secondPetals.eccentricity,
      angle
    );
    svgContent += `
    <path d="${path}" fill="yellow" stroke="#2F4F4F" stroke-width="4"/>`;
  }

  // Draw scalloped center circle
  const scallopedPath = generateScallopedCircle(
    centerX,
    centerY,
    params.circleRadius,
    params.numScallops,
    params.scallopDepth
  );
  svgContent += `
    <path d="${scallopedPath}" fill="yellow" stroke="#2F4F4F" stroke-width="4" />`;

  // Draw center hexagon
  const hexagonPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 6;
    const x = centerX + params.hexagonRadius * Math.cos(angle);
    const y = centerY + params.hexagonRadius * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");

  svgContent += `
    <polygon points="${hexagonPoints}" fill="yellow" stroke="black" stroke-width="4"/>
  </g>
</svg>`;
  return svgContent;
}

// Generate SVG content
// const svgContent = generateDaffodil();

// Write to file
// fs.writeFileSync("daffodil.svg", svgContent);
// console.log("SVG file generated: daffodil.svg");
