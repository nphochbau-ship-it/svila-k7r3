import asyncio,sys
from playwright.async_api import async_playwright
U=sys.argv[1];SH='/workspace/kokon-junak/shots/'
BOT="""window.__bot=setInterval(()=>{const K=__kk,S=K.S;if(K.st!=='play'||S.kind!=='def')return;
const L=S.en.slice();if(S.boss&&!S.boss.dead&&S.boss.fly<=0)L.push(S.boss);let b=null,bd=1e9;
for(const e of L){const d=Math.hypot(e.x-180,e.y-innerHeight/(innerWidth/360)*.36);if(d<bd){bd=d;b=e}}if(S.pow>=1&&S.en.length>=3)K.power();if(b&&bd<170)K.hitAt(b.x,b.y)},350)"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
    ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2.5,is_mobile=True,has_touch=True)
    pg=await ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    await pg.goto(U+'?mute');await pg.wait_for_function("__kk.st!=='load'");await pg.wait_for_timeout(800);await pg.screenshot(path=SH+'01-naslovna.png')
    await pg.mouse.click(195,844-65);await pg.wait_for_timeout(500);print('st',await pg.evaluate('[__kk.st,__kk.LV]'))
    await pg.evaluate(BOT)
    for lv in (1,2,3,4):
      await pg.evaluate(f'__kk.start({lv})');shot=False
      for i in range(900):
        await pg.wait_for_timeout(100)
        s=await pg.evaluate('[__kk.st,__kk.LV,__kk.S.kills,__kk.S.coc,__kk.S.en.length,__kk.S.boss?__kk.S.boss.hp:-1]')
        if not shot and (s[4]>=3 or (lv==4 and s[5]>=0 and i>60)):shot=True;await pg.screenshot(path=SH+f'0{lv+1}-nivo{lv}.png')
        if s[0]!='play':break
      print('L',lv,s);await pg.wait_for_timeout(800);await pg.screenshot(path=SH+f'0{lv+1}b-nivo{lv}-kraj.png')
    await pg.evaluate('__kk.S.hero.vic=1;__kk.st="win"');await pg.wait_for_timeout(300)
    await pg.mouse.click(195,await pg.evaluate('innerHeight*.3+160*innerWidth/360'));await pg.wait_for_timeout(1500);print('hatch',await pg.evaluate('__kk.st'))
    await pg.screenshot(path=SH+'06-kokon-puca.png');await pg.wait_for_timeout(1800);await pg.screenshot(path=SH+'07-leptir.png')
    await pg.wait_for_timeout(3000);print('after hatch',await pg.evaluate('[__kk.st,__kk.LV]'))
    await pg.evaluate("window.__fb=setInterval(()=>{const S=__kk.S;if(S.kind==='fly'){S.hurt=2;S.ty=innerHeight/(innerWidth/360)*(.3+.3*Math.sin(Date.now()/700))}},100)")
    await pg.wait_for_timeout(6000);await pg.screenshot(path=SH+'08-let.png')
    for i in range(300):
      await pg.wait_for_timeout(100)
      if await pg.evaluate('__kk.st')!='play':break
    print('L5',await pg.evaluate('[__kk.st,__kk.S.stars]'));await pg.wait_for_timeout(500);await pg.screenshot(path=SH+'09-pobjeda.png')
    await pg.evaluate('__kk.start(1);__kk.S.coc=1;__kk.S.banner=0');await pg.wait_for_timeout(100);await pg.evaluate('clearInterval(__bot)')
    for i in range(100):
      await pg.wait_for_timeout(100)
      if await pg.evaluate('__kk.st')=='over':break
    print('over',await pg.evaluate('__kk.st'));await pg.screenshot(path=SH+'10-ups.png')
    print('ERRORS',errs);await b.close()
asyncio.run(main())
