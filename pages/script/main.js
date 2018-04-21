
// 서브메뉴
$(".main_menu > li > a, .sub_menu").hover(function(e){
    $(".main_header").stop().animate({"height" : "175px"}, 400, function(){});
    $(".sub_menu").removeClass("clocking");
}, function(){
    $(".main_header").stop().animate({"height" : "70px"}, 400, function(){});
    $(".sub_menu").addClass("clocking");
});





$(window).load(function(){

});


