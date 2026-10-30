const {chromium}=require('@playwright/test');
const fs=require('node:fs/promises');
(async()=>{
 const base=process.env.BASE_URL,output=process.env.CAPTURE_OUTPUT;if(!base||!output)throw Error('Set BASE_URL and CAPTURE_OUTPUT');await fs.mkdir(output,{recursive:true});
 const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
 for(const [name,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]){
  const page=await browser.newPage({viewport,locale:'en-US',colorScheme:'dark'});
  for(const [label,route] of [['index','/full/'],['project','/projects/nathan-riley/'],['home','/']]){
   await page.goto(base+route);await page.waitForTimeout(5000);await page.screenshot({path:output+'/'+name+'-'+label+'.png'});
  }
  await page.getByRole('button',{name:'Profile',exact:true}).click();await page.waitForTimeout(1800);await page.screenshot({path:output+'/'+name+'-profile.png'});await page.close();
 }
 await browser.close();
})();
