/* ■■■■■■■■■■■■■■■■

    fadeIn/Out 배너

   ■■■■■■■■■■■■■■■■ */
var interval;
var curIndex = 0; // 현재 이미지 번호
var imgCnt = 0; // 총 이미지 수
var btnCorol = ""; // 배너버튼색상
var preIndex; // 이전 이미지 번호
var nextIndex; // 다음 이미지 번호

imgCnt = $(".banner_inner > li").length;
$(".banner_inner > li").eq(curIndex).css("opacity", 1).css("z-index", 2); // 첫 번째 이미지의 투명도=1, z-index=2

// 배너기능 실행
function fadeInBanner(){

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

    fadeInOutAnimate(preIndex, nextIndex);

    // 해당배너 인덱스에 맞는 색상
    btnCorol = bannerColor(nextIndex);

    $(".banner_btn > li").eq(preIndex).css("background","#aaa");
    $(".banner_btn > li").eq(nextIndex).css("background",btnCorol);

    console.log("fadeInBanner curIndex : " + curIndex);


} // fadeInBanner() 끝


// 투명도 , z-index 애니메이션 효과
function fadeInOutAnimate(pre, next){

    // 이전(현재) 이미지의 z-index를 1로 변경, 투명도를 0로 애니메이션효과(fadeOut), 완료 후엔 z-index를 0으로
    $(".banner_inner > li").eq(pre).css("z-index", 1).stop().animate({"opacity" : 0}, 500, function(){ $(this).css("z-index", 0) });

    // 다음 이미지의 z-index를 2로 변경, 투명도를 1로 애니메이션효과(fadeIn)
    $(".banner_inner > li").eq(next).css("z-index", 2).stop().animate({"opacity" : 1}, 500, function(){});

} // fadeInOutAnimate 끝


 // 배너시작
interval = setInterval(fadeInBanner, 2000);

 // 배너에 마우스오버 시 배너멈춤
$(".banner_inner").hover(function(){
    clearInterval(interval);

 // 마우스 내리면 시작
}, function(){
    interval = setInterval(fadeInBanner, 2000);
});


// 해당배너 색상찾기
function bannerColor(banNo){

    var reColor  = "" ;

    switch(banNo){
            case 0 : reColor = "#FFCD30"; break;
            case 1 : reColor = "#730046"; break;
            case 2 : reColor = "#E88E34"; break;
            case 3 : reColor = "#B4BF35"; break;
            case 4 : reColor = "#C93F0F"; break;
    }

    return reColor;
}


// 배너 버튼에 마우스오버 시 배너멈추고 해당배너 화면으로 이동
$(".banner_btn > li").hover(function(){
    var btnNo; // 선택된 버튼의 index

    clearInterval(interval); // 배너멈춤

    btnNo = $(this).index();

    btnCorol = bannerColor(btnNo);

    $(".banner_btn > li").not(this).css("background","#aaa");
    $(this).css("background",btnCorol);


    fadeInOutAnimate(curIndex, btnNo);

    curIndex = btnNo; // 보여질 배너 인덱스 재설


//마우스 내리면 시작
}, function(){
    interval = setInterval(fadeInBanner, 2000);
});

