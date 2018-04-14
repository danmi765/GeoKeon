/* 게시판 에디터 활성화 , 이미지 업로드 활성화 */
CKEDITOR.replace( 'editor1', {
    filebrowserUploadUrl: '../topic/upload'
});

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













