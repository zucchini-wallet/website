const fs=require('node:fs'),path=require('node:path'),sharp=require(process.env.SHARP_MODULE||'sharp');
const root=__dirname,mark=fs.readFileSync(path.join(root,'masters/primary/zucchini-mark.png')).toString('base64');
(async()=>{
 for(const [name,w,h] of [['social-header',1500,500],['wide-banner',1920,640]]){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 1500 500"><rect width="1500" height="500" fill="#111a14"/><image x="970" y="35" width="430" height="430" xlink:href="data:image/png;base64,${mark}"/><text x="320" y="170" font-family="Arial" font-size="52" font-weight="700" fill="#f3ce54">zucchini.</text><text x="320" y="265" font-family="Arial" font-size="64" fill="#f2f4ec">Your ZEC. Your rules.</text><text x="320" y="325" font-family="Arial" font-size="27" fill="#b8bfb0">Self-custody. Shielded payments. Open source.</text></svg>`;
 await sharp(Buffer.from(svg)).png().toFile(path.join(root,`banners/${name}-${w}x${h}.png`));
 }
 const chunks=[];for(const [code,size] of [['icp4',16],['icp5',32],['ic07',128],['ic08',256],['ic09',512],['ic10',1024]]){
 const data=fs.readFileSync(path.join(root,`desktop/Zucchini.iconset/icon_${size===1024?512:size}x${size===1024?512:size}${size===1024?'@2x':''}.png`));const header=Buffer.alloc(8);header.write(code);header.writeUInt32BE(data.length+8,4);chunks.push(header,data);
 }
 const head=Buffer.alloc(8);head.write('icns');head.writeUInt32BE(8+chunks.reduce((n,b)=>n+b.length,0),4);fs.writeFileSync(path.join(root,'desktop/zucchini.icns'),Buffer.concat([head,...chunks]));
})();
