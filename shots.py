import asyncio
from playwright.async_api import async_playwright
D='/workspace/kokon-junak/shots/'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
    ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2.5,is_mobile=True,has_touch=True,record_video_dir='/tmp/vid',record_video_size={'width':390,'height':844})
    pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8765/?mute');await pg.wait_for_timeout(800)
    async def hit(i=0):return await pg.evaluate(f'(()=>{{const e=__kk.S.en.filter(e=>!e.dead)[{i}];if(e)__kk.hitAt(e.x,e.y);return !!e}})()')
    await pg.evaluate("localStorage.setItem('kk-who','malik');__kk.start(2);__kk.S.banner=0;for(let i=0;i<4;i++)__kk.spawn()");await pg.wait_for_timeout(2500)
    await hit();await pg.wait_for_timeout(185);await pg.screenshot(path=D+'11-udarac-impact.png')
    await pg.wait_for_timeout(230);await pg.screenshot(path=D+'12-odbacivanje-knockback.png')
    for k in range(10):
      await hit();await pg.wait_for_timeout(450)
      await pg.evaluate('if(__kk.S.en.filter(e=>!e.dead).length<2)__kk.spawn()')
    await pg.evaluate('for(let i=0;i<4;i++)__kk.spawn();__kk.S.pow=1');await pg.wait_for_timeout(1800);await pg.screenshot(path=D+'13-moc-pun.png')
    await pg.evaluate('__kk.power()');await pg.wait_for_timeout(350);await pg.screenshot(path=D+'14-moc-malik-vatra.png')
    await pg.wait_for_timeout(1500)
    await pg.evaluate("__kk.start(4);__kk.S.banner=0;__kk.S.t=3");await pg.wait_for_timeout(1500)
    await pg.evaluate('const b=__kk.S.boss;__kk.hitAt(b.x,b.y)');await pg.wait_for_timeout(190);await pg.screenshot(path=D+'15-ptica-udarac.png');await pg.wait_for_timeout(1500)
    await pg.evaluate("__kk.start(3);__kk.S.banner=0;for(let i=0;i<5;i++)__kk.spawn()");await pg.wait_for_timeout(2200)
    await pg.evaluate("__kk.S.pow=1");await pg.evaluate("localStorage.setItem('kk-who','jakub')")
    await pg.evaluate("location.reload()");await pg.wait_for_timeout(1000)
    await pg.evaluate("__kk.start(3);__kk.S.banner=0;for(let i=0;i<5;i++)__kk.spawn()");await pg.wait_for_timeout(2300)
    await hit();await pg.wait_for_timeout(600);await pg.evaluate('__kk.S.pow=1;__kk.power()');await pg.wait_for_timeout(300);await pg.screenshot(path=D+'16-moc-jakub-munja.png');await pg.wait_for_timeout(1200)
    await pg.evaluate("__kk.start(5);__kk.S.banner=0");await pg.wait_for_timeout(2500);await pg.evaluate('__kk.S.pow=1;__kk.power()');await pg.wait_for_timeout(1500);await pg.screenshot(path=D+'17-let-pucanje.png')
    print(errs);await ctx.close();await b.close()
asyncio.run(main())
