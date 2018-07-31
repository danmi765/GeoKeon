

// 디자인 등록, 수정 페이지 이미지 변경 시
$(".design_file_btn").change(function(){ 
    var file_name = $(this).val();
    $(this).siblings(".upload_file_name_box").html(file_name);
})

// 리스트 메인이미지 삽입
for(var i =0; i<img_list_arr.length; i++){
    $(".list_main_img_"+i).attr("src", img_path + "designUploads/" + img_list_arr[i][0]);
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
        for(var i=0; i<img_list_arr[li_idx].length; i++){

            // 이미지가 없을 경우
            if(img_list_arr[li_idx][i] == " "){
                $(".design_thumbnail_img > li").eq(i).children("img").attr("nimg", "y");
                console.log(i + " : 이미지가 없습니다.");

            // 이미자가 있을 경우
            }else{
                $(".design_thumbnail_img > li").eq(i).children("img").attr("src", img_path + "designUploads/" + img_list_arr[li_idx][i]);
                console.log(i + " : " + img_list_arr[li_idx][i]);
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
 * @description 포트폴리오 메뉴 글쓰기
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


