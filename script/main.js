
/* header,  footer 삽입 */
// var header = "<div data-role='header' id='main_header'><ul><li><a href='#intro_page'>소개</a></li><li><a href='#design_page'>디자인</a></li><li><a href='#comm_page'>커뮤니티</a></li></ul></div>";
//
// var footer = "<div data-role='footer' id='main_footer'>FOOTER</div>";
//
// $(".page_box").append(footer);
// $(".page_box").prepend(header);
$(window).load(function(){

    /* PAGE 내에 HEADER,FOOTER 태그 추가 */
    $(".page_box").prepend("<header class='header_main_page'></header>");
    $(".page_box").append("<footer class='footer_main_page'></footer>");

    $( 'header' ).load( 'header.html', function() {
        console.log( 'header.html' );
        $('#main_page').enhanceWithin();
    });
    $( 'footer' ).load( 'footer.html', function() {
        console.log( 'footer.html' );
        $('#main_page').enhanceWithin();
    });


})


/* 배너 */

var interval;
var curIndex = 0;
var imgCnt = 0;

imgCnt = $(".main_banner_inner > li > img").length;
$(".main_banner_inner> li").eq(curIndex).css("opacity", 1).css("z-index", 2);

function fadeInBanner(){

    var preIndex;
    var nextIndex;
    preIndex = curIndex;
    ++curIndex;

    if(curIndex == imgCnt){
        curIndex = nextIndex = 0;
    }else{
        nextIndex = curIndex;
    }

    $(".main_banner_inner> li").eq(preIndex).css("z-index", 1).stop().animate({"opacity" : 0}, 500, function(){ $(this).css("z-index", 0) });

    $(".main_banner_inner> li").eq(nextIndex).css("z-index", 2).stop().animate({"opacity" : 1}, 500, function(){});


} // fadeInBanner() End


 // 배너시작
interval = setInterval(fadeInBanner, 2000);

 // 마우스오버 시 배너멈춤
$(".main_banner_inner").hover(function(){

    clearInterval(interval);
 // 마우스 내리면 시작
}, function(){

    interval = setInterval(fadeInBanner, 2000);

});
