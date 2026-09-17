// Run with Sharp installed, or set SHARP_MODULE to an existing installation.
const fs=require('node:fs');
const path=require('node:path');
const sharp=require(process.env.SHARP_MODULE||'sharp');
const root=__dirname;
const mark=path.join(root,'masters/primary/zucchini-mark.png');
const icon=path.join(root,'masters/primary/zucchini-app-icon.png');
const outputFiles=[];
async function png(source,destination,size){
 const out=path.join(root,destination);fs.mkdirSync(path.dirname(out),{recursive:true});
 await sharp(source).resize(size,size,{fit:'contain',background:'#00000000'}).png().toFile(out);
 outputFiles.push({file:destination,width:size,height:size});
}
(async()=>{
 for(const size of [16,24,32,48,64,128,256,512])await png(mark,`extension/icon-${size}.png`,size);
 for(const size of [20,29,40,58,60,76,80,87,120,152,167,180,1024])await png(icon,`mobile/ios/icon-${size}.png`,size);
 for(const size of [48,72,96,144,192,512])await png(icon,`mobile/android/legacy-${size}.png`,size);
 for(const size of [16,24,32,48,64,128,256,512,1024])await png(icon,`desktop/icon-${size}.png`,size);
 for(const size of [256,400,512,1024])await png(icon,`social/avatar-${size}.png`,size);
 for(const size of [16,32,48,180,192,512])await png(size===180?icon:mark,`website/icon-${size}.png`,size);
 await png(mark,'website/zucchini-mark.png',1024);
 // Windows ICO with PNG payloads, supporting current Windows releases.
 const sizes=[16,32,48,256];const buffers=await Promise.all(sizes.map(s=>fs.promises.readFile(path.join(root,`desktop/icon-${s}.png`))));
 const header=Buffer.alloc(6+16*sizes.length);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);let offset=header.length;
 sizes.forEach((size,i)=>{const p=6+16*i;header[p]=size===256?0:size;header[p+1]=header[p];header.writeUInt16LE(1,p+4);header.writeUInt16LE(32,p+6);header.writeUInt32LE(buffers[i].length,p+8);header.writeUInt32LE(offset,p+12);offset+=buffers[i].length;});
 fs.writeFileSync(path.join(root,'desktop/zucchini.ico'),Buffer.concat([header,...buffers]));
 // macOS iconset sources for iconutil.
 for(const size of [16,32,128,256,512]){
  await png(icon,`desktop/Zucchini.iconset/icon_${size}x${size}.png`,size);
  await png(icon,`desktop/Zucchini.iconset/icon_${size}x${size}@2x.png`,size*2);
 }
 fs.writeFileSync(path.join(root,'exports.json'),JSON.stringify({primary:'masters/primary/',alternate:'masters/alternate/',exports:outputFiles},null,2)+'\n');
 console.log(`Exported ${outputFiles.length} PNGs and Windows ICO.`);
})();
