
var tap_num=0; // 탭번호 


 
$(".thumbnail_box > ul").hide(); // 썸네일ul모두제거



businessIdChange(tap_num); // 셀렉트박스 바꾸면실행

// paging li 생성
var ul_length = $(".thumbnail_box > ul").length; // ul의 수
var li_length ; // li의 수 
var page_length; // page의 수
var curr_page = 1 ; // 현재페이지 번호

for(var i=0; i<ul_length; i++){
    li_length = $(".thumbnail_box > ul").eq(i).children("li").length;
    page_length = Math.ceil(li_length / 9);

    var paging_content = 
    '<li class="paging_li">'
    +'<span class="prev_btn"><a href="javascript:designListPaging(null, \'prev\')" >prev</a></span>'
    +'<p class="page_btn"></p>'
    +'<span class="next_btn"><a href="javascript:designListPaging(null, \'next\')" >next</a></span>' 
    +'</li>';
    
    $(".thumbnail_box > ul").eq(i).append(paging_content).each(function(){

        for(var n=0; n<page_length; n++){
            $(".thumbnail_box > ul").eq(i).find(".paging_li > p").append('<a class="page_num page_num_'+ (n+1) +'" href="javascript:designListPaging('+ (n+1) +')" >'+ (n+1)+'</a>');
        }
    });
}


designListPaging(1); // 페이징

// paging
function designListPaging(n, btn){


    var open_ul_id = $(".open_ul").attr("id");
    var open_ul_li = $("#"+ open_ul_id).children("li") ;

    if(n == null){
        if(btn == 'prev'){
            n = curr_page -1;
            if(n < 1){ n = 1; alert("첫 페이지 입니다");return;}

        }else if (btn == 'next'){
            n = curr_page + 1;
            if(n > Math.ceil(open_ul_li.length/9) ) { n = n-1;alert("마지막 페이지 입니다.");return;}
        }
    }
    
    $(".page_num").removeClass("seleted_page_num");
    $(".page_num_"+n).addClass("seleted_page_num");


    curr_page = n;

    var start_num = (n-1) * 9 ; 
    var end_num = n * 9 ;

    open_ul_li.addClass("gk-clocking");

    console.log("start_num:,", start_num)
    console.log("end_num:,", end_num)

    for(var k=start_num; k < end_num; k++){
        open_ul_li.eq(k).removeClass("gk-clocking");
    }

    $(".paging_li").removeClass("gk-clocking");


}

// select박스 선택 시 해당 썸네일공개
function businessIdChange(n){
    if(!n){
        tap_num = $("select[name=tap]").val();
    }else{
        tap_num = n;
    }

    var list_ul = $(".thumbnail_box > ul") ;
    var selected_ul = $(".thumbnail_box > ul").eq(Number(tap_num)-1);

    list_ul.hide();
    list_ul.removeClass("open_ul");
    list_ul.addClass("close_ul");
    selected_ul.show();
    selected_ul.addClass("open_ul");
    selected_ul.removeClass("close_ul");
    
    // 해당 업종의 포트폴리오 갯수가 없으면 디자인이없습니다 출력
    var design_ul = $("#tap_" + tap_num); 
    if( design_ul.children("li").length == 1 ){
        console.log("b");
        design_ul.html("<li>");
        design_ul.children("li").append("디자인이 없습니다.");
    }


}

// 수정페이지 업종select 선택을위한 변수
var select_business_number = $("select[name=business_num] > option").length 

// 수정페이지 이미지이름 로드
if(db_img){
    img_arr = db_img.split(",");
    for(var i=0; i<3; i++){
                
        $(".db_origin_name").eq(i).attr("value", img_arr[i]);

            if(img_arr[i] == " "){
                img_arr[i] = "이미지가 없습니다.";
            }

            $(".upload_file_name_box").eq(i).html(img_arr[i]);

    }
}

// 수정페이지 업종구분 select박스 선택
if(business_number){
    for(var i=0; i<select_business_number; i++){
        if( $("select[name=business_num] > option").eq(i).val() == business_number ){
            $("select[name=business_num] > option").eq(i).prop("selected",true);
        }
    }
}


// 디자인 등록, 수정 페이지 이미지 변경 시
$(".design_file_btn").change(function(){ 
    var file_name = $(this).val();
    $(this).siblings(".upload_file_name_box").html(file_name);
})

// 리스트 메인이미지 삽입
for(var i =0; i<design_img_list_arr.length; i++){
    $(".list_main_img_"+i).attr("src", img_path + "designUploads/" + design_img_list_arr[i][0]);
}

// 메인이미지 마우스오버 시 디자인타이틀 텍스트 숨김
$(".design_thumbnail > li > img").hover(function(){
   $(this).siblings(".design_title").hide();
    
// 메인이미지 마우스아웃 시 디자인타이틀 텍스트 보임
}, function(){
    $(".design_title").show();
});

// 메인이미지 클릭 시 썸네일 팝 띄우기
$(".design_thumbnail > li > img").click(function(ab){

    // 포트폴리오 번호 저장
    var pp_id = $(this).siblings(".design_title").attr("ppId");
    $("input[name=design_id]").attr("value", pp_id);

    // 썸네일 배경 생성
    $(".design_thumbnail_pop").show();
    // 브라우저 스크롤바 제거
    $("html").addClass("overflow_hidden_item");
    // 썸네일 팝업창 애니메이션 효과주며 생성
    $(".design_thumbnail_pop_img_box").stop().animate({"height" : "85%"}, 400, function(){
        // 닫기버튼 생성
        $(".design_thumbnail_pop_close_btn").show();

        // 해당 li의 index를 이용하여 팝업의 이미지 삽입
        var li_idx =  $(ab.target).attr("ab");

        // 썸네일 이미지
        for(var i=0; i<design_img_list_arr[li_idx].length; i++){

            // 이미지가 없을 경우
            if(design_img_list_arr[li_idx][i] == " "){
                $(".design_thumbnail_img > li").eq(i).children("img").attr("nimg", "y");
                console.log(i + " : 이미지가 없습니다.");

            // 이미자가 있을 경우
            }else{
                $(".design_thumbnail_img > li").eq(i).children("img").attr("src", img_path + "designUploads/" + design_img_list_arr[li_idx][i]);
                console.log(i + " : " + design_img_list_arr[li_idx][i]);
            }
        }

        // 모든 이미지 안보이기
        $(".design_thumbnail_img > li").css("display","none");
        // PC메인 이미지만 보이기
        $(".design_thumbnail_img > li").eq(0).css("display","flex");

    });
});

// PC,모바일,테블릿 버튼 눌렀을 때 해당 이미지 띄우기
$(".design_thumbnail_cate_btn > li").click(function(){
    // 클릭 된 버튼의 속성 aim의 값 추출.
    var aim_num = $(this).attr("aim");
    console.log("aim_num--->", aim_num);

    // 추출된 속성값과 같은 targ값의 이미지 띄우기 그 외 이미지 지우기
    $(".design_thumbnail_img > li").css("display","none");

    // 띄우는 이미지가 존재하지 않을 경우
    if( $(".design_thumbnail_img > li").eq(aim_num).children("img").attr("nimg") == "y"){
        $(".design_thumbnail_img > li").eq("3").css("display","flex");

    // 존재 할 경우
    }else{
        $(".design_thumbnail_img > li").eq(aim_num).css("display","flex");
    }

});


// 썸네일 팝 닫기
$(".design_thumbnail_pop_close_btn").click(function(){
    // 기존 이미지 제거
    $(".design_thumbnail_img > li > img").attr("src", "");

    // 기존 이미지없음 속성 제거
    $(".design_thumbnail_img > li > img").attr("nimg", "");

    // 닫기버튼 제거
    $(".design_thumbnail_pop_close_btn").hide();
    // 썸네일 팝업창 애니메이션 효과주며 제거
    $(".design_thumbnail_pop_img_box").stop().animate({"height" : "10%"}, 400, function(){
        // 썸네일 배경 제거
        $(".design_thumbnail_pop").hide();
        // 브라우저 스크롤바 생성
        $("html").removeClass("overflow_hidden_item");
    });
});


/**
 * @author 배건희
 * @description 포트폴리오 글쓰기
 *
 */
function designUploadSubmit(){

    if( $("input[name=design_name]").val() == "" ){
        alert("포트폴리오명을 입력해주세요.");
        $("input[name=design_name]").focus();
    }else if( $("select[name=business_num]").val() == "업종선택" || $("select[name=business_num]").val() == 0 ){
        alert("업종을 선택하세요.");
    }else if ( $("input[name=pc_main]").val() == "" && $("input[name=mobile_main]").val() == "" && $("input[name=tablet_main]").val() == "" ){
        alert("포트폴리오 PC메인 이미지는 반드시 존재해야 합니다.");
    }else if( $("input[name=pc_main]").val() == "" ){
        alert("포트폴리오 PC메인 이미지는 반드시 존재해야 합니다.");
    }else{
        document.getElementById("design_img_upload_form").submit();
    }

}  

/**
 * @author 배건희
 * @description 포트폴리오수정 유효성검사
 */
function designModifySubmit(){

    if( $("input[name=design_name]").val() == "" ){
        alert("포트폴리오명을 입력해주세요.");
        $("input[name=design_name]").focus();
    }else if( $("select[name=business_num]").val() == "업종선택" || $("select[name=business_num]").val() == 0 ){
        alert("업종을 선택하세요.");
    }else{
        document.getElementById("design_img_modify_form").submit();
    }

}



/**
 * @author 배건희
 * @description 디자인 삭제
 */
function designDelete(){
    if( confirm('삭제하시겠습니까?') ){

        $("#design_del_or_modi_from").attr("method","get");
        $("#design_del_or_modi_from").attr("action","/designDelOrModi?design_id="+$("input[name=design_id]").val() );
        document.getElementById('design_del_or_modi_from').submit();
    }
}


/**
 * @author 배건희
 * @description 디자인 수정
 */
function designModify(){

    $("#design_del_or_modi_from").attr("method","post");
       document.getElementById('design_del_or_modi_from').submit();
}