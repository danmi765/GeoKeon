/* ■■■■■■■■■■■■■■■■

    slide 배너  : 버튼작업 필요

   ■■■■■■■■■■■■■■■■ */
var interval;
var curPosi = 0; // 현재 위치
var curImg = 0; // 총 이미지 수
var direction = 1; // 1 : 정방향,  -1 : 역방향

curImg = $(".banner_inner > li").length;

function slideBanner(){

    var nextPosi; // 다음 위치

    // 정방향일 경우
    if( direction == 1 ){
        nextPosi = curPosi - 100;
        $(".banner_inner").css("left", curPosi + "%").stop().animate({"left" : nextPosi + "%"}, 3000, function(){ $(this).css("left", curPosi + "%")});
        curPosi = curPosi - 100 ;

    // 역방향일 경우
    }else if( direction == -1 ){
        nextPosi = curPosi + 100;
        $(".banner_inner").css("left", curPosi + "%").stop().animate({"left" : nextPosi + "%"}, 3000, function(){ $(this).css("left", nextPosi + "%")});
        curPosi = curPosi + 100 ;


    }

    // 마지막 또는 처음 이미지일 경우 방향전환
    if( nextPosi == (curImg-1)*-100 ){ direction = -1; }
    else if( curPosi == 0 ){ direction = 1; }

}  // slideBanner 끝


 // 배너시작
interval = setInterval(slideBanner, 7000);


 // 마우스오버 시 배너멈춤
$(".banner_inner").hover(function(){
    clearInterval(interval);

 // 마우스 내리면 시작
}, function(){
    interval = setInterval(slideBanner, 7000);
});
