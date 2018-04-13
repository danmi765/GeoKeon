
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













