
/* header,  footer 삽입 */
var header = "<div data-role='header' id='main_header'><ul><li><a href='#intro_page'>소개</a></li><li><a href='#design_page'>디자인</a></li><li><a href='#comm_page'>커뮤니티</a></li></ul></div>";

var footer = "<div data-role='footer' id='main_footer'>FOOTER</div>";

$(".page_box").append(footer);
$(".page_box").prepend(header);
