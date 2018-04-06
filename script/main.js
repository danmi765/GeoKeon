
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


});


/* banner */
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















