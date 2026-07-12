const SoundEngine = (()=>{
  let ctx=null;
  function context(){
    if(!ctx) ctx=new (window.AudioContext||window.webkitAudioContext)();
    return ctx;
  }
  function beep(type="cursor"){
    if(data?.settings?.soundEnabled===false) return;
    try{
      const c=context();
      const o=c.createOscillator();
      const g=c.createGain();
      const map={cursor:[720,0.045],confirm:[920,0.07],save:[1040,0.11],cancel:[330,0.08]};
      const [freq,duration]=map[type]||map.cursor;
      o.type="square";o.frequency.value=freq;
      g.gain.setValueAtTime(0.045,c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+duration);
      o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+duration);
    }catch{}
  }
  return {beep};
})();
