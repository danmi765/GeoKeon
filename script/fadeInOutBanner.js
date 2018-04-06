/* ■■■■■■■■■■■■■■■■

    fadeIn/Out 배너  : .banner의 height가 지정되지 않아 이미지이동버튼 위치를 지정할 수가 없다.  첫 페이지 로딩시에는 fadeIn/Out이 되지 않는다.

   ■■■■■■■■■■■■■■■■ */
var interval;
var curIndex = 0; // 현재 이미지 번호
var imgCnt = 0; // 총 이미지 수

imgCnt = $(".banner_inner > li").length;
$(".banner_inner > li").eq(curIndex).css("opacity", 1).css("z-index", 2); // 첫 번째 이미지의 투명도=1, z-index=2

function fadeInBanner(){

    var preIndex; // 이전 이미지 번호
    var nextIndex; // 다음 이미지 번호
    preIndex = curIndex;
    ++curIndex;

    // 현재 이미지 번호가 마지막 이미지 번호와 같다면
    if(curIndex == imgCnt){
        // 다음 이미지 번호는 0으로
        curIndex = nextIndex = 0;

    // 그렇지 않다면
    }else{
        // 다음 이미지 번호는 +1
        nextIndex = curIndex;
    }

    // 이전(현재) 이미지의 z-index를 1로 변경, 투명도를 0로 애니메이션효과(fadeOut), 완료 후엔 z-index를 0으로
    $(".banner_inner> li").eq(preIndex).css("z-index", 1).stop().animate({"opacity" : 0}, 500, function(){ $(this).css("z-index", 0) });

    // 다음 이미지의 z-index를 2로 변경, 투명도를 1로 애니메이션효과(fadeIn)
    $(".banner_inner> li").eq(nextIndex).css("z-index", 2).stop().animate({"opacity" : 1}, 500, function(){});


} // fadeInBanner() 끝


 // 배너시작
interval = setInterval(fadeInBanner, 2000);

 // 마우스오버 시 배너멈춤
$(".banner_inner").hover(function(){
    clearInterval(interval);

 // 마우스 내리면 시작
}, function(){
    interval = setInterval(fadeInBanner, 2000);
});
