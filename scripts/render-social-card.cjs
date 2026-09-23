// npm install --no-save sharp, then node scripts/render-social-card.cjs
// SHARP_MODULE may point to an existing Sharp installation.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const root = path.resolve(__dirname, '..');
const mark = fs.readFileSync(path.join(root, 'dist/assets/zucchini-mark-v3.png')).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#111a14"/>
<image x="60" y="42" width="42" height="42" xlink:href="data:image/png;base64,${mark}"/>
<text x="112" y="73" font-family="Arial" font-size="32" font-weight="700" fill="#f2f4ec">zucchini<tspan fill="#f3ce54">.</tspan></text>
<text x="64" y="150" font-family="Arial" font-size="15" letter-spacing="2" fill="#bfc5b8">MADE FOR ZCASH. BUILT FOR YOU.</text>
<text x="58" y="267" font-family="Arial" font-size="96" letter-spacing="-6" fill="#f2f4ec">Your ZEC.</text>
<text x="58" y="372" font-family="Arial" font-size="96" letter-spacing="-6" fill="#f2f4ec">Your <tspan font-family="Georgia" font-style="italic" fill="#f3ce54">rules.</tspan></text>
<text x="64" y="444" font-family="Arial" font-size="23" fill="#b8bfb0">A self-custody Zcash wallet.</text>
<text x="64" y="480" font-family="Arial" font-size="23" fill="#b8bfb0">Built for shielded payments.</text>
<circle cx="906" cy="315" r="225" fill="none" stroke="#dce4b8" stroke-opacity=".08"/>
<ellipse cx="906" cy="315" rx="216" ry="105" fill="none" stroke="#9fa785" stroke-width="2" transform="rotate(-30 906 315)"/>
<image x="715" y="122" width="382" height="382" xlink:href="data:image/png;base64,${mark}"/>
<ellipse cx="906" cy="315" rx="212" ry="87" fill="none" stroke="#c2c8a5" stroke-opacity=".65" stroke-width="2" transform="rotate(46 906 315)"/>
<rect x="951" y="133" width="190" height="37" rx="4" fill="#161b14" stroke="#596044"/><text x="970" y="157" font-family="Arial" font-size="12" letter-spacing="1" fill="#f2f4ec">PRIVATE BY DESIGN</text>
<rect x="694" y="454" width="190" height="37" rx="4" fill="#161b14" stroke="#596044"/><text x="711" y="478" font-family="Arial" font-size="12" letter-spacing="1" fill="#f2f4ec">YOUR KEYS. ALWAYS.</text>
<path d="M64 548 H1136" stroke="#ffffff" stroke-opacity=".12"/>
<text x="64" y="591" font-family="Arial" font-size="18" fill="#a5aca0">Self-custody. Shielded payments. Open source.</text>
<text x="1136" y="591" text-anchor="end" font-family="Arial" font-size="18" fill="#f3ce54">zucchinifi.xyz</text>
</svg>`;
sharp(Buffer.from(svg)).png().toFile(path.join(root, 'dist/assets/zucchini-social-v3.png')).then(info => console.log(`${info.width} × ${info.height}, ${info.size} bytes`));
