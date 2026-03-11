import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface CelestialObject {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  render: string;
}

const celestialObjects: CelestialObject[] = [
  { id: "meteoroid", name: "Meteoroid", subtitle: "Space Debris", category: "Solar System", render: "meteoroid" },
  { id: "asteroid", name: "Asteroid", subtitle: "Minor Planet", category: "Solar System", render: "asteroid" },
  { id: "comet", name: "Comet", subtitle: "Icy Body", category: "Solar System", render: "comet" },
  { id: "dwarf-planet", name: "Dwarf Planet", subtitle: "Sub-Planetary", category: "Solar System", render: "dwarfplanet" },
  { id: "moon", name: "Moon", subtitle: "Natural Satellite", category: "Solar System", render: "moon" },
  { id: "planet", name: "Planet", subtitle: "Major Body", category: "Solar System", render: "planet" },
  { id: "brown-dwarf", name: "Brown Dwarf", subtitle: "Failed Star", category: "Stellar", render: "browndwarf" },
  { id: "red-dwarf", name: "Red Dwarf", subtitle: "Small Star", category: "Stellar", render: "reddwarf" },
  { id: "star", name: "Star", subtitle: "Main Sequence", category: "Stellar", render: "star" },
  { id: "giant-star", name: "Giant Star", subtitle: "Evolved Star", category: "Stellar", render: "giantstar" },
  { id: "white-dwarf", name: "White Dwarf", subtitle: "Stellar Remnant", category: "Extreme", render: "whitedwarf" },
  { id: "neutron-star", name: "Neutron Star", subtitle: "Collapsed Star", category: "Extreme", render: "neutronstar" },
  { id: "pulsar", name: "Pulsar", subtitle: "Rotating Neutron Star", category: "Extreme", render: "pulsar" },
  { id: "black-hole", name: "Black Hole", subtitle: "Singularity", category: "Extreme", render: "blackhole" },
  { id: "quasar", name: "Quasar", subtitle: "Active Galactic Nucleus", category: "Extreme", render: "quasar" },
  { id: "magnetar", name: "Magnetar", subtitle: "Magnetic Neutron Star", category: "Extreme", render: "magnetar" },
  { id: "nebula", name: "Nebula", subtitle: "Gas Cloud", category: "Large-Scale", render: "nebula" },
  { id: "supernova", name: "Supernova Remnant", subtitle: "Explosion Debris", category: "Large-Scale", render: "supernova" },
  { id: "star-cluster", name: "Star Cluster", subtitle: "Stellar Group", category: "Large-Scale", render: "starcluster" },
  { id: "galaxy", name: "Galaxy", subtitle: "Star System", category: "Large-Scale", render: "galaxy" },
  { id: "galaxy-cluster", name: "Galaxy Cluster", subtitle: "Cosmic Structure", category: "Large-Scale", render: "galaxycluster" },
  { id: "cosmic-web", name: "Cosmic Web", subtitle: "Universe Structure", category: "Large-Scale", render: "cosmicweb" },
];

function CelestialCanvas({ type, size = 80 }: { type: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = size * window.devicePixelRatio || size;
    canvas.width = s;
    canvas.height = s;
    const cx = s / 2, cy = s / 2, r = s / 2 - 2;

    function noise(x: number, y: number, t: number) {
      return Math.sin(x * 3.1 + t) * Math.cos(y * 2.7 - t * 0.7) * 0.5 +
             Math.sin(x * 7.3 - t * 1.3) * Math.cos(y * 5.1 + t * 0.9) * 0.3 +
             Math.sin(x * 13.7 + t * 0.5) * Math.cos(y * 11.3 - t * 1.1) * 0.2;
    }

    function drawPlanet(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, s, s);
      const imgData = ctx.createImageData(s, s);
      const d = imgData.data;
      for (let py = 0; py < s; py++) {
        for (let px = 0; px < s; px++) {
          const dx = px - cx, dy = py - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > r) continue;
          const nx = dx / r, ny = dy / r;
          const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
          const lon = Math.atan2(nx, nz) + t * 0.3;
          const lat = Math.asin(ny);
          const n = noise(lon * 2, lat * 3, t * 0.2);
          const ocean = n < 0.1;
          let rgb;
          if (ocean) {
            const depth = (n + 0.3) * 2;
            rgb = [20 + depth * 30, 60 + depth * 80, 120 + depth * 80];
          } else {
            const h = n * 3;
            if (h < 0.5) rgb = [100 + h * 100, 140 + h * 60, 60];
            else if (h < 1.5) rgb = [60 + h * 80, 130, 40];
            else rgb = [140 + h * 30, 120 + h * 20, 80];
          }
          const light = Math.max(0.1, nz * 0.7 + 0.3 + nx * 0.2);
          const i4 = (py * s + px) * 4;
          d[i4] = rgb[0] * light; d[i4+1] = rgb[1] * light; d[i4+2] = rgb[2] * light; d[i4+3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      const atm = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r + 4);
      atm.addColorStop(0, "rgba(100,160,255,0)");
      atm.addColorStop(1, "rgba(80,140,255,0.35)");
      ctx.beginPath(); ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
      ctx.fillStyle = atm; ctx.fill();
    }

    function drawStar(t: number, color1 = [255, 220, 100], color2 = [255, 160, 40], size_mod = 1) {
      if (!ctx) return;
      ctx.clearRect(0, 0, s, s);
      const imgData = ctx.createImageData(s, s);
      const d = imgData.data;
      for (let py = 0; py < s; py++) {
        for (let px = 0; px < s; px++) {
          const dx = px - cx, dy = py - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > r * size_mod) continue;
          const nx = dx / (r * size_mod), ny = dy / (r * size_mod);
          const n = noise(nx * 4, ny * 4, t * 0.5) * 0.5 + 0.5;
          const coreFactor = 1 - (dist / (r * size_mod));
          const mix = Math.min(1, n * coreFactor * 2);
          const i4 = (py * s + px) * 4;
          d[i4]   = color1[0] + (color2[0] - color1[0]) * (1 - mix);
          d[i4+1] = color1[1] + (color2[1] - color1[1]) * (1 - mix);
          d[i4+2] = color1[2] + (color2[2] - color1[2]) * (1 - mix);
          d[i4+3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      const glow = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 1.8);
      glow.addColorStop(0, `rgba(${color1[0]},${color1[1]},${color1[2]},0.4)`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(cx, cy, r * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = glow; ctx.fill();
    }

    function drawMoon(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, s, s);
      const imgData = ctx.createImageData(s, s);
      const d = imgData.data;
      for (let py = 0; py < s; py++) {
        for (let px = 0; px < s; px++) {
          const dx = px - cx, dy = py - cy;
          if (Math.sqrt(dx*dx+dy*dy) > r) continue;
          const nx = dx/r, ny = dy/r, nz = Math.sqrt(Math.max(0,1-nx*nx-ny*ny));
          const n = noise(nx*6, ny*6, 0) * 0.5 + 0.5;
          const base = 140 + n * 80;
          const light = Math.max(0.05, nz * 0.8 + 0.2 + nx * 0.15);
          const v = base * light;
          const i4 = (py*s+px)*4;
          d[i4]=v; d[i4+1]=v; d[i4+2]=v*1.05; d[i4+3]=255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    function drawBlackHole(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, s, s);
      for (let angle = 0; angle < Math.PI * 2; angle += 0.02) {
        for (let rad = r * 0.45; rad < r * 1.1; rad += 1) {
          const twist = (rad - r * 0.45) * 0.08 + t * 0.8;
          const ax = cx + Math.cos(angle + twist) * rad;
          const ay = cy + Math.sin(angle + twist) * rad * 0.3;
          const heat = 1 - (rad - r * 0.45) / (r * 0.65);
          ctx.fillStyle = `rgba(${255 * heat},${120 * heat},${20 * heat * 0.5},0.06)`;
          ctx.fillRect(ax, ay, 1.5, 1.5);
        }
      }
      const eh = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.42);
      eh.addColorStop(0, "rgba(0,0,0,1)");
      eh.addColorStop(0.7, "rgba(0,0,0,1)");
      eh.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.45, 0, Math.PI*2);
      ctx.fillStyle = eh; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.43, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(255,180,50,${0.5 + 0.2 * Math.sin(t)})`;
      ctx.lineWidth = 1.5; ctx.stroke();
    }

    function drawNebula(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, s, s);
      const colors = [[255,80,120],[80,140,255],[120,220,180],[200,100,255]];
      for (let layer = 0; layer < 4; layer++) {
        const imgData = ctx.createImageData(s, s);
        const d = imgData.data;
        const c = colors[layer];
        for (let py = 0; py < s; py++) {
          for (let px = 0; px < s; px++) {
            const nx = (px-cx)/r, ny = (py-cy)/r;
            if (nx*nx+ny*ny > 1) continue;
            const n = noise(nx*3+layer*2, ny*3+layer*1.5, t*0.1+layer) * 0.5 + 0.5;
            const alpha = Math.max(0, n - 0.3) * 180;
            const i4 = (py*s+px)*4;
            d[i4]=c[0]; d[i4+1]=c[1]; d[i4+2]=c[2]; d[i4+3]=alpha;
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }
    }

    function drawGalaxy(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, s, s);
      const numStars = 800;
      for (let i = 0; i < numStars; i++) {
        const frac = i / numStars;
        const armAngle = frac * Math.PI * 6 + (i % 2) * Math.PI;
        const rad = frac * r * 0.9;
        const spread = (Math.random() - 0.5) * r * 0.15 * frac;
        const x = cx + Math.cos(armAngle + t * 0.1) * (rad + spread);
        const y = cy + Math.sin(armAngle + t * 0.1) * (rad + spread) * 0.45;
        const bright = 1 - frac * 0.7;
        const hue = frac < 0.3 ? `rgba(200,220,255,${bright*0.8})` : `rgba(255,200,150,${bright*0.6})`;
        ctx.fillStyle = hue;
        ctx.fillRect(x, y, frac < 0.1 ? 2 : 1, frac < 0.1 ? 2 : 1);
      }
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, r*0.3);
      core.addColorStop(0,"rgba(255,240,200,0.9)"); core.addColorStop(1,"rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(cx,cy,r*0.3,0,Math.PI*2); ctx.fillStyle=core; ctx.fill();
    }

    function drawPulsar(t: number) {
      if (!ctx) return;
      ctx.clearRect(0,0,s,s);
      for (let jet = 0; jet < 2; jet++) {
        const dir = jet === 0 ? 1 : -1;
        for (let i = 0; i < 30; i++) {
          const len = (i/30) * r;
          const spread = Math.sin(t*5 + i*0.3) * (i/30) * r * 0.15;
          const alpha = (1 - i/30) * 0.7;
          ctx.fillStyle = `rgba(100,200,255,${alpha})`;
          ctx.beginPath(); ctx.arc(cx + spread, cy + dir*len, 2, 0, Math.PI*2); ctx.fill();
        }
      }
      const grad = ctx.createRadialGradient(cx,cy,0,cx,cy,r*0.35);
      grad.addColorStop(0,"rgba(200,240,255,1)"); grad.addColorStop(0.6,"rgba(100,180,255,0.9)"); grad.addColorStop(1,"rgba(50,100,200,0)");
      ctx.beginPath(); ctx.arc(cx,cy,r*0.35,0,Math.PI*2); ctx.fillStyle=grad; ctx.fill();
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(t*3);
      ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,r*0.9,-0.3,0.3); ctx.closePath();
      ctx.fillStyle="rgba(150,220,255,0.15)"; ctx.fill(); ctx.restore();
    }

    function drawComet(t: number) {
      if (!ctx) return;
      ctx.clearRect(0,0,s,s);
      const tailLen = r * 1.4;
      const tail = ctx.createLinearGradient(cx + r*0.3, cy, cx - tailLen, cy - tailLen*0.3);
      tail.addColorStop(0,"rgba(150,200,255,0.6)"); tail.addColorStop(1,"rgba(100,180,255,0)");
      ctx.beginPath(); ctx.moveTo(cx+r*0.3, cy);
      ctx.bezierCurveTo(cx-r*0.2, cy-r*0.1, cx-tailLen*0.7, cy-tailLen*0.2, cx-tailLen, cy-tailLen*0.3);
      ctx.lineWidth = r*0.4; ctx.strokeStyle=tail; ctx.stroke();
      const nuc = ctx.createRadialGradient(cx,cy,0,cx,cy,r*0.3);
      nuc.addColorStop(0,"rgba(220,240,255,1)"); nuc.addColorStop(1,"rgba(100,160,220,0)");
      ctx.beginPath(); ctx.arc(cx,cy,r*0.3,0,Math.PI*2); ctx.fillStyle=nuc; ctx.fill();
      const coma = ctx.createRadialGradient(cx,cy,r*0.2,cx,cy,r*0.55);
      coma.addColorStop(0,"rgba(180,220,255,0.3)"); coma.addColorStop(1,"rgba(100,180,255,0)");
      ctx.beginPath(); ctx.arc(cx,cy,r*0.55,0,Math.PI*2); ctx.fillStyle=coma; ctx.fill();
    }

    function drawAsteroid(t: number) {
      if (!ctx) return;
      ctx.clearRect(0,0,s,s);
      const imgData = ctx.createImageData(s,s);
      const d = imgData.data;
      for (let py=0;py<s;py++){for(let px=0;px<s;px++){
        const dx=px-cx,dy=py-cy;
        const distort = noise(dx/r*2,dy/r*2,0)*0.15;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist > r*(0.82+distort)) continue;
        const nx=dx/r,ny=dy/r,nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny));
        const n=noise(nx*8,ny*8,0)*0.5+0.5;
        const v=60+n*80;
        const light=Math.max(0.1,nz*0.7+0.3+nx*0.2);
        const i4=(py*s+px)*4;
        d[i4]=v*light*1.1;d[i4+1]=v*light;d[i4+2]=v*light*0.9;d[i4+3]=255;
      }}
      ctx.putImageData(imgData,0,0);
    }

    function drawStarCluster(t: number) {
      if (!ctx) return;
      ctx.clearRect(0,0,s,s);
      for(let i=0;i<120;i++){
        const angle = (i/120)*Math.PI*2 + Math.sin(i*0.7)*0.5;
        const rad = r*(0.1 + 0.7*(((i*2654435761)%1000)/1000));
        const x = cx + Math.cos(angle)*rad;
        const y = cy + Math.sin(angle)*rad*0.85;
        const size2 = 1 + ((i*1234567)%100)/100 * 2;
        const brightness = 0.4 + ((i*987654)%100)/100 * 0.6;
        const blue = i%3===0;
        ctx.fillStyle = blue ? `rgba(150,180,255,${brightness})` : `rgba(255,240,200,${brightness})`;
        ctx.beginPath(); ctx.arc(x,y,size2,0,Math.PI*2); ctx.fill();
      }
    }

    function drawMagnetar(t: number) {
      if (!ctx) return;
      ctx.clearRect(0,0,s,s);
      for(let line=0;line<8;line++){
        const baseAngle = (line/8)*Math.PI*2 + t*0.5;
        ctx.beginPath();
        for(let step=0;step<=40;step++){
          const frac = step/40;
          const fieldAngle = baseAngle + Math.sin(frac*Math.PI)*1.2;
          const fieldR = r*0.35 + frac*(r*0.8-r*0.35);
          const pulse = 1+0.1*Math.sin(t*4+line);
          const x = cx + Math.cos(fieldAngle)*fieldR*pulse;
          const y = cy + Math.sin(fieldAngle)*fieldR*pulse*0.7;
          step===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        const alpha = 0.15+0.1*Math.sin(t*3+line);
        ctx.strokeStyle=`rgba(180,100,255,${alpha})`; ctx.lineWidth=1; ctx.stroke();
      }
      const core = ctx.createRadialGradient(cx,cy,0,cx,cy,r*0.3);
      core.addColorStop(0,"rgba(220,180,255,1)"); core.addColorStop(0.5,"rgba(150,80,220,0.8)"); core.addColorStop(1,"rgba(80,30,150,0)");
      ctx.beginPath(); ctx.arc(cx,cy,r*0.3,0,Math.PI*2); ctx.fillStyle=core; ctx.fill();
    }

    function drawSupernova(t: number) {
      if (!ctx) return;
      ctx.clearRect(0,0,s,s);
      for(let shell=3;shell>=0;shell--){
        const shellR = r*(0.3+shell*0.2) + Math.sin(t*0.5)*r*0.05;
        const alpha = 0.15-shell*0.02;
        const colors2 = ["rgba(255,100,50", "rgba(255,160,80", "rgba(200,100,255", "rgba(80,150,255"];
        for(let ray=0;ray<24;ray++){
          const angle = (ray/24)*Math.PI*2 + shell*0.4;
          const jitter = noise(Math.cos(angle)*2,Math.sin(angle)*2,t*0.3+shell)*r*0.15;
          ctx.beginPath(); ctx.moveTo(cx,cy);
          ctx.lineTo(cx+Math.cos(angle)*(shellR+jitter), cy+Math.sin(angle)*(shellR+jitter));
          ctx.strokeStyle=`${colors2[shell]},${alpha})`; ctx.lineWidth=2+shell; ctx.stroke();
        }
      }
      const core2 = ctx.createRadialGradient(cx,cy,0,cx,cy,r*0.25);
      core2.addColorStop(0,"rgba(255,255,255,0.9)"); core2.addColorStop(1,"rgba(255,150,80,0)");
      ctx.beginPath(); ctx.arc(cx,cy,r*0.25,0,Math.PI*2); ctx.fillStyle=core2; ctx.fill();
    }

    function drawQuasar(t: number) {
      if (!ctx) return;
      ctx.clearRect(0,0,s,s);
      for(let jet=0;jet<2;jet++){
        const dir = jet===0?1:-1;
        for(let i=0;i<50;i++){
          const frac=i/50;
          const jx = Math.sin(t*2+i*0.2)*frac*r*0.2;
          const jy = dir*frac*r*0.95;
          const alpha=(1-frac)*0.5;
          ctx.fillStyle=`rgba(100,200,255,${alpha})`;
          ctx.beginPath(); ctx.arc(cx+jx,cy+jy,2*(1-frac)+0.5,0,Math.PI*2); ctx.fill();
        }
      }
      for(let ring=0;ring<20;ring++){
        const ringR = r*0.25 + ring*(r*0.65/20);
        const heat = 1-ring/20;
        ctx.beginPath(); ctx.ellipse(cx,cy,ringR,ringR*0.25,t*0.1,0,Math.PI*2);
        ctx.strokeStyle=`rgba(${255*heat},${150*heat},${50*heat*0.5},0.3)`; ctx.lineWidth=2; ctx.stroke();
      }
      const core3 = ctx.createRadialGradient(cx,cy,0,cx,cy,r*0.2);
      core3.addColorStop(0,"rgba(255,255,255,1)"); core3.addColorStop(1,"rgba(255,200,100,0)");
      ctx.beginPath(); ctx.arc(cx,cy,r*0.2,0,Math.PI*2); ctx.fillStyle=core3; ctx.fill();
    }

    function drawWhiteDwarf(t: number) {
      if (!ctx) return;
      ctx.clearRect(0,0,s,s);
      const glow2 = ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.5);
      glow2.addColorStop(0,"rgba(220,240,255,1)"); glow2.addColorStop(0.4,"rgba(180,210,255,0.6)"); glow2.addColorStop(1,"rgba(100,150,255,0)");
      ctx.beginPath(); ctx.arc(cx,cy,r*1.5,0,Math.PI*2); ctx.fillStyle=glow2; ctx.fill();
      const body = ctx.createRadialGradient(cx,cy,0,cx,cy,r*0.28);
      body.addColorStop(0,"rgba(255,255,255,1)"); body.addColorStop(1,"rgba(200,220,255,1)");
      ctx.beginPath(); ctx.arc(cx,cy,r*0.28,0,Math.PI*2); ctx.fillStyle=body; ctx.fill();
    }

    function drawGalaxyCluster(t: number) {
      if (!ctx) return;
      ctx.clearRect(0,0,s,s);
      const galaxyPositions = [{x:0,y:0},{x:-r*0.3,y:-r*0.25},{x:r*0.35,y:-r*0.15},{x:-r*0.2,y:r*0.3},{x:r*0.25,y:r*0.28},{x:0,y:-r*0.38}];
      const dm = ctx.createRadialGradient(cx,cy,0,cx,cy,r);
      dm.addColorStop(0,"rgba(80,100,180,0.15)"); dm.addColorStop(1,"rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fillStyle=dm; ctx.fill();
      galaxyPositions.forEach((pos,i)=>{
        const gx=cx+pos.x, gy=cy+pos.y;
        const gr = r*0.12;
        for(let star=0;star<60;star++){
          const a=(star/60)*Math.PI*2 + Math.sin(star*0.7)*0.5;
          const rad2=gr*(0.05+0.85*(((star*2654435761)%1000)/1000));
          ctx.fillStyle=star%4===0?"rgba(150,180,255,0.8)":"rgba(255,240,200,0.6)";
          ctx.fillRect(gx+Math.cos(a)*rad2, gy+Math.sin(a)*rad2*0.45, 1, 1);
        }
        const coreG = ctx.createRadialGradient(gx,gy,0,gx,gy,gr*0.4);
        coreG.addColorStop(0,"rgba(255,240,200,0.8)"); coreG.addColorStop(1,"rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(gx,gy,gr*0.4,0,Math.PI*2); ctx.fillStyle=coreG; ctx.fill();
      });
    }

    function drawCosmicWeb(t: number) {
      if (!ctx) return;
      ctx.clearRect(0,0,s,s);
      const nodes: {x: number, y: number}[] = [];
      for(let i=0;i<18;i++){
        const angle=(i/18)*Math.PI*2+Math.sin(i*1.3)*0.4;
        const rad2=r*(0.2+0.65*(((i*2654435761)%1000)/1000));
        nodes.push({x:cx+Math.cos(angle)*rad2, y:cy+Math.sin(angle)*rad2});
      }
      nodes.forEach((n1,i)=>{
        nodes.forEach((n2,j)=>{
          if(j<=i) return;
          const dx=n2.x-n1.x,dy=n2.y-n1.y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          if(dist>r*0.65) return;
          const alpha=Math.max(0,(1-dist/(r*0.65))*0.35);
          ctx.beginPath(); ctx.moveTo(n1.x,n1.y); ctx.lineTo(n2.x,n2.y);
          ctx.strokeStyle=`rgba(150,180,255,${alpha})`; ctx.lineWidth=0.5; ctx.stroke();
        });
      });
      nodes.forEach(n=>{
        const ng=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,r*0.06);
        ng.addColorStop(0,"rgba(200,220,255,0.9)"); ng.addColorStop(1,"rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(n.x,n.y,r*0.06,0,Math.PI*2); ctx.fillStyle=ng; ctx.fill();
      });
    }

    function drawBrownDwarf(t: number) {
      drawStar(t, [160,90,40],[120,60,20], 0.85);
    }
    function drawRedDwarf(t: number) {
      drawStar(t, [255,100,60],[200,60,30], 0.75);
    }
    function drawGiantStar(t: number) {
      drawStar(t, [255,140,60],[220,80,20], 1.0);
    }
    function drawDwarfPlanet(t: number) {
      if (!ctx) return;
      ctx.clearRect(0,0,s,s);
      const imgData=ctx.createImageData(s,s);
      const d=imgData.data;
      for(let py=0;py<s;py++){for(let px=0;px<s;px++){
        const dx=px-cx,dy=py-cy;
        if(Math.sqrt(dx*dx+dy*dy)>r*0.7) continue;
        const nx=dx/(r*0.7),ny=dy/(r*0.7),nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny));
        const n=noise(nx*5,ny*5,0)*0.5+0.5;
        const v=100+n*60;
        const light=Math.max(0.1,nz*0.7+0.3);
        const i4=(py*s+px)*4;
        d[i4]=v*light*0.95;d[i4+1]=v*light*0.9;d[i4+2]=v*light;d[i4+3]=255;
      }}
      ctx.putImageData(imgData,0,0);
    }
    function drawMeteoroid(t: number) {
      if (!ctx) return;
      ctx.clearRect(0,0,s,s);
      const imgData=ctx.createImageData(s,s);
      const d=imgData.data;
      for(let py=0;py<s;py++){for(let px=0;px<s;px++){
        const dx=px-cx*1.1,dy=py-cy;
        const distort=noise(dx/r*3,dy/r*3,0)*0.2;
        if(Math.sqrt(dx*dx+dy*dy)>r*(0.45+distort)) continue;
        const nx=dx/r,ny=dy/r,nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny));
        const n=noise(nx*10,ny*10,0)*0.5+0.5;
        const v=50+n*70;
        const light=Math.max(0.05,nz*0.8+0.3+nx*0.15);
        const i4=(py*s+px)*4;
        d[i4]=v*light*1.1;d[i4+1]=v*light;d[i4+2]=v*light*0.9;d[i4+3]=255;
      }}
      ctx.putImageData(imgData,0,0);
      const trail=ctx.createLinearGradient(cx+r*0.2,cy,cx-r*0.6,cy+r*0.2);
      trail.addColorStop(0,"rgba(255,150,80,0.4)"); trail.addColorStop(1,"rgba(255,100,50,0)");
      ctx.beginPath(); ctx.moveTo(cx+r*0.2,cy-r*0.1);
      ctx.lineTo(cx-r*0.6,cy+r*0.1); ctx.lineWidth=r*0.25;
      ctx.strokeStyle=trail; ctx.stroke();
    }

    const renderers: Record<string, (t: number) => void> = {
      planet: drawPlanet, star: drawStar, moon: drawMoon, blackhole: drawBlackHole,
      nebula: drawNebula, galaxy: drawGalaxy, pulsar: drawPulsar, comet: drawComet,
      asteroid: drawAsteroid, starcluster: drawStarCluster, magnetar: drawMagnetar,
      supernova: drawSupernova, quasar: drawQuasar, whitedwarf: drawWhiteDwarf,
      galaxycluster: drawGalaxyCluster, cosmicweb: drawCosmicWeb, browndwarf: drawBrownDwarf,
      reddwarf: drawRedDwarf, giantstar: drawGiantStar, dwarfplanet: drawDwarfPlanet,
      meteoroid: drawMeteoroid, neutronstar: drawMagnetar,
    };

    const needsAnimation = ["planet","star","blackhole","nebula","galaxy","pulsar","comet","magnetar","supernova","quasar","whitedwarf","giantstar","reddwarf","browndwarf","neutronstar"];
    const isAnimated = needsAnimation.includes(type);

    if (isAnimated) {
      const loop = () => {
        timeRef.current += 0.016;
        renderers[type]?.(timeRef.current);
        animRef.current = requestAnimationFrame(loop);
      }
      animRef.current = requestAnimationFrame(loop);
    } else {
      renderers[type]?.(0);
    }

    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [type, size]);

  return <canvas ref={canvasRef} style={{ width: size, height: size, borderRadius: "50%" }} />;
}

const categories = ["All", "Solar System", "Stellar", "Extreme", "Large-Scale"];

export default function CelestialObjects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered = activeCategory === "All" ? celestialObjects : celestialObjects.filter(o => o.category === activeCategory);

  return (
    <section className="relative py-20 overflow-hidden" id="observatory">
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:0.15} 50%{opacity:0.7} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .obj-card { transition: transform 0.3s ease, filter 0.3s ease; cursor: pointer; }
        .obj-card:hover { transform: translateY(-6px) scale(1.05); filter: brightness(1.2); }
        .cat-btn { border: 1px solid rgba(180,200,255,0.2); background: transparent; color: rgba(200,210,255,0.7);
          padding: 7px 20px; border-radius: 20px; cursor: pointer; font-family: 'Cinzel', serif;
          font-size: 11px; letter-spacing: 1px; transition: all 0.2s; }
        .cat-btn:hover { background: rgba(100,130,255,0.15); color: white; border-color: rgba(180,200,255,0.5); }
        .cat-btn.active { background: rgba(120,150,255,0.25); color: white; border-color: rgba(180,200,255,0.6); }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-accent tracking-widest uppercase text-accent">Observatory</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl md:text-5xl font-bold mb-6"
          >
            Celestial Objects
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto italic font-body"
          >
            From meteoroids to the cosmic web — rendered in real time through procedural animations.
          </motion.p>

          {/* Category filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex gap-3 justify-center flex-wrap mt-10"
          >
            {categories.map(cat => (
              <button key={cat} className={`cat-btn ${activeCategory===cat?"active":""}`}
                onClick={() => setActiveCategory(cat)}>{cat}</button>
            ))}
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
          {filtered.map((obj, i) => (
            <motion.div 
              key={obj.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02 }}
              className="obj-card flex flex-col items-center gap-4"
              onMouseEnter={() => setHovered(obj.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Orb container */}
              <div 
                className="relative rounded-full transition-all duration-300"
                style={{
                  filter: hovered===obj.id
                    ? "drop-shadow(0 0 20px rgba(150,180,255,0.6))"
                    : "drop-shadow(0 4px 12px rgba(0,0,50,0.8))",
                }}
              >
                <div className="relative z-10">
                  <CelestialCanvas type={obj.render} size={90} />
                </div>
                {/* Underglow */}
                <div className={`absolute inset-0 rounded-full bg-accent/20 blur-xl transition-opacity duration-300 ${hovered === obj.id ? 'opacity-100' : 'opacity-0'}`} />
              </div>

              <div className="text-center">
                <div className="font-heading text-sm font-semibold text-foreground tracking-wide mb-1">
                  {obj.name}
                </div>
                <div className="text-[10px] text-muted-foreground font-accent italic uppercase tracking-wider">
                  {obj.subtitle}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
