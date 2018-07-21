
function errorRender(mode){
  var timeout = 5;
  var timeoutInterval = setInterval(() => {
    document.querySelector('#err-tictoc').textContent = timeout;
    timeout = timeout - 1;
    if(timeout < 0){
      clearInterval(timeoutInterval);
      if(!mode){
        history.back();
      }else if(mode=='ajax'){
        history.go();
      }
    }
  }, 1000);
}