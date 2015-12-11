$(function(){
  canvas = document.getElementById('c');
  ctx = canvas.getContext('2d');
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  buffers = [];
  MAXHIST = -1;
  ind = 0;
  mx = 0;
  my = 0;
  choverflg = false;
  $("body").mousedown(function(eo){if(eo.which=="1")drawStart()});
  $("body").mouseup(function(){
    if(choverflg){
      ind++;
      saveCtx();
      choverflg = false;
    }
  })
  $("body").mousemove(function(eo){
    mousepos(eo.pageX, eo.pageY, eo.which)
  });
  $("#clear").click(function(){
    if(window.confirm("クリアしてよろしいですか？"))clear();
  });
  $("#prev").click(prevHist);
  $("#next").click(nextHist);
  $("#hist").click(clearHist);
  clear();

  makePalletes();
});

function drawStart(){
  ctx.beginPath();
  ctx.moveTo(mx, my);
}
function draw() {
  line(mx, my);
}
function mousepos(x, y, mb) {
  mx = x - canvas.offsetLeft;
  my = y - canvas.offsetTop;
//  $("#debug").html("mx:"+mx+" my:"+my);
  if(mb == "1"){
    line(mx, my);
    if(mx>=0 && mx<=640 && my>=0 && my<=480)choverflg=true;
  }
}
function line(x, y){
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function clear(){
  whiteRect();
  clearHist();
}
function whiteRect(){
  fillStyleBuf = ctx.fillStyle;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0,0,640,480);
  ctx.fillStyle = fillStyleBuf;
}
function clearHist(){
  ind=0;
  buffers = null; //メモリ開放
  buffers = [];
  saveCtx();
}

function prevHist(){
  if(ind==0)return;
  ind--;
  loadCtx(ind);
}
function nextHist(){
  if(ind==buffers.length-1)return;
  ind++;
  loadCtx(ind);
}

function saveCtx(){
  if(ind==MAXHIST){
    buffers.shift();
    ind = MAXHIST-1;
  }
  buffers[ind] = ctx.getImageData(0, 0, 640, 480);
  if(buffers.length > ind+1){
    buffers.splice(ind+1, buffers.length-ind-1);
  }
  buttonReload();
}
function loadCtx(ind){
  whiteRect();
  ctx.putImageData(buffers[ind],0, 0);
  buttonReload();
}
function buttonReload(){
  if(ind==0){
    $("#prev").attr("disabled", "disabled");
  } else {
    $("#prev").removeAttr("disabled");
  }
  if(ind==buffers.length-1){
    $("#next").attr("disabled", "disabled");
  } else {
    $("#next").removeAttr("disabled");
  }
}

function makePalletes(){
  tar = $("#palletes");
  for(i=0;i<24;i++){
    r = ("00"+Math.floor(Math.random()*256).toString(16)).slice(-2);
    g = ("00"+Math.floor(Math.random()*256).toString(16)).slice(-2);
    b = ("00"+Math.floor(Math.random()*256).toString(16)).slice(-2);
    tar.append('<div class="pallete" style="background-color:#'+r+g+b+';"></div>').children(":last").click(function(){
      ctx.fillStyle = $(this).css("background-color");
      ctx.strokeStyle = $(this).css("background-color");
      $("#palletes").children().each(function(){
        $(this).children(":first").removeClass("selected");
      })
      $(this).children(":first").addClass("selected");
    }).append('<div></div>');
  }
}
