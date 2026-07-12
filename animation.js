const AnimationEngine = (()=>{
  function init(){
    document.documentElement.classList.toggle("reduced-motion", Boolean(data?.settings?.reducedMotion));
  }
  return {init};
})();
AnimationEngine.init();
