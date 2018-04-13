/* ■■■■■■■■■■■■■■■■

    slide 배너  : 버튼작업 필요

   ■■■■■■■■■■■■■■■■ */
var interval;
var curPosi = 0; // 현재 위치
var nextPosi; // 다음 위치
var curImg = 0; // 총 이미지 수
var direction = 1; // 1 : 정방향,  -1 : 역방향
var btnNo; // 버튼의 인덱스

curImg = $(".banner_inner > li").length;

// 첫 로딩 시 첫번째 하단배너버튼 표시
$(".banner_btn > li").eq(0).css("background-image","url(img/slideBtnOver.png)");

function slideBanner(){

    // 하단배너버튼 표시제거
    $(".banner_btn > li").removeAttr("style");

    // 배너인덱스에 따라 하단버튼 인덱스 지정
    switch(curPosi){
        case 0 : btnNo = 0; break;
        case -100 : btnNo = 1; break;
        case -200 : btnNo = 2; break;
        case -300 : btnNo = 3; break;
        case -400 : btnNo = 4; break;
    }


    // 정방향일 경우
    if( direction == 1 ){
        nextPosi = curPosi - 100;
        $(".banner_inner").css("left", curPosi + "%").stop().animate({"left" : nextPosi + "%"}, 3000, function(){ $(this).css("left", curPosi + "%")});
        curPosi = curPosi - 100 ;

        $(".banner_btn > li").eq(btnNo+1).css("background-image","url(img/slideBtnOver.png)");

    // 역방향일 경우
    }else if( direction == -1 ){
        nextPosi = curPosi + 100;
        $(".banner_inner").css("left", curPosi + "%").stop().animate({"left" : nextPosi + "%"}, 3000, function(){ $(this).css("left", nextPosi + "%")});
        curPosi = curPosi + 100 ;

        $(".banner_btn > li").eq(btnNo-1).css("background-image","url(img/slideBtnOver.png)");

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


// 하단버튼 마우스오버 시 해당버튼 이미지변경
$(".banner_btn > li").hover(function(){

    clearInterval(interval); // 배너멈춤

    btnNo = $(this).index(); // 선택된 버튼인덱스 추출

    $(".banner_btn > li").not(this).removeAttr("style");
    $(this).css("background-image","url(img/slideBtnOver.png)");

    curPosi = btnNo * -100;

    $(".banner_inner").stop().animate({"left" : curPosi + "%"}, 1000, function(){ $(this).css("left", curPosi + "%")});

    // 마지막 또는 처음 이미지일 경우 방향전환
    if( curPosi == (curImg-1)*-100 ){ direction = -1; }
    else if( curPosi == 0 ){ direction = 1; }

}, function(){});











