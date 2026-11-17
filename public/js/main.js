(function(){
  var items=['ROUND 1: SURVIVE','○ △ □','PLAYER 208 IS ALIVE','HIRE THE LAST ONE STANDING','STAY ON GREEN','NO BUGS, NO MERCY'];
  var s=items.join('   ✕   ')+'   ✕   ';
  document.getElementById('tk').textContent=s+s;

  var hero=document.getElementById('hero'),state=document.getElementById('state'),stats=document.getElementById('stats'),
      fill=document.getElementById('fill'),runner=document.getElementById('runner'),msg=document.getElementById('msg'),
      cap=document.getElementById('cap'),run=document.getElementById('run'),skip=document.getElementById('skip'),
      content=document.getElementById('content'),clear=document.getElementById('clear');
  var progress=0,holding=false,red=false,done=false,timer=null,tick=null,deaths=0,t0=Date.now();

  function setLight(r){
    red=r; window.__red=r; hero.classList.toggle('red',r);
    state.textContent=r?'Red light: freeze!':'Green light: run!';
    cap.textContent=r?'I see you moving…':'Turned away…';
  }
  function paint(){
    fill.style.width=progress+'%';
    runner.style.left='calc('+progress+'% - '+(progress*0.22)+'px)';
    stats.textContent='Time '+((Date.now()-t0)/1000).toFixed(1)+'s · Eliminations '+deaths;
  }
  function schedule(){
    clearTimeout(timer);
    timer=setTimeout(function(){setLight(!red);schedule();}, red?1100+Math.random()*700:1200+Math.random()*1800);
  }
  function eliminate(){
    deaths++; window.dispatchEvent(new Event('eliminated')); progress=0; holding=false; t0=Date.now(); paint();
    hero.classList.remove('dead'); void hero.offsetWidth; hero.classList.add('dead');
    msg.textContent='Eliminated! You moved on red. Back to the start line.';
  }
  function unlock(flash){
    clearTimeout(timer);clearInterval(tick);done=true;
    content.classList.add('open');
    var go=function(){document.getElementById('pool').scrollIntoView({behavior:'smooth'});};
    if(flash){clear.classList.add('show');setTimeout(function(){clear.classList.remove('show');go();},1500);}
    else setTimeout(go,300);
  }
  function press(e){if(e)e.preventDefault();if(done)return;holding=true;if(red)eliminate();}
  function release(){holding=false;}

  tick=setInterval(function(){
    if(done)return;
    if(holding){
      if(red){eliminate();return;}
      progress=Math.min(100,progress+1.6);
      if(progress>=100){paint();var tm=(Date.now()-t0)/1000;msg.textContent='Survived in '+tm.toFixed(1)+'s with '+deaths+' eliminations.';window.dispatchEvent(new CustomEvent('survived',{detail:{time:tm,deaths:deaths}}));unlock(true);return;}
    }
    paint();
  },60);

  run.addEventListener('pointerdown',press);
  window.addEventListener('pointerup',release);
  window.addEventListener('pointercancel',release);
  run.addEventListener('contextmenu',function(e){e.preventDefault();});
  window.addEventListener('keydown',function(e){if(e.code==='Space'&&!e.repeat)press(e);});
  window.addEventListener('keyup',function(e){if(e.code==='Space')release();});
  skip.addEventListener('click',function(){msg.textContent='VIP entrance used. Welcome in.';unlock(false);});
  setLight(false);schedule();paint();
})();
