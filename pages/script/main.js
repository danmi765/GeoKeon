
// 서브메뉴
$(".header_main_menu > li > a, .header_sub_menu").hover(function(e){
    $(".header_area_wrapper").stop().animate({"height" : "175px"}, 400, function(){});
    $(".header_sub_menu").removeClass("clocking");
}, function(){
    $(".header_area_wrapper").stop().animate({"height" : "70px"}, 400, function(){});
    $(".header_sub_menu").addClass("clocking");
});





$(window).load(function(){

});


