var id_chk = 0; // 아이디 중복체크 유효성 검사용 변수
var joins; // 암호화를 위함 key

loadBoardDomainList();  // (로드 될때마다 실행)게시판 목록 불러오기

// 회원탈퇴박스 가리기
$(".reasons_box").hide();

// 게시판 목록 불러오기
function loadBoardDomainList(param){
    connectToServer('/loadcommlist', '', 'GET', function(err, res){
        if(err){
            console.log("서버오류 ---> ", err);
            return false;
        }
        //실패
        if(res.error){
            /* 
                [ res.error.errno ]
                1406 ---> Data Too Long
                1054 ---> Bad Sql
                1062 ---> PK 중복
            */
            console.log("DB오류 ---> " + res.error.errno);
            connectToServer("/error", {msg : res.error.code}, "post", function(err, res){
                $('html').html(res);
            });
            return false ;
        }

        // console.log('[loadBoardDomainList]res', res);

        res.forEach(function(d,i){
            /* 페이지 제목 주기 */
            /* url의 맨 마지막 파라미터와 반복문 돌고 있는 BOARD_DOMAIN_ID와 일치하면 페이지 제목 주기 */
            var commName;
            if(location.pathname.split('/')[2] && Number(location.pathname.split('/')[2]) == NaN){
                commName = Number(location.pathname.split('/')[2]);
            }else if(location.pathname.split('/')[2]){
                commName = Number(location.pathname.split('/')[2].split('&')[0]);
            }
            if($('.contents_title').length > 0 && d['BOARD_DOMAIN_ID'] == commName){
                /* 페이지 헤더 타이틀 넣기 */
                $('title').text('커뮤니티 : ' + d['BOARD_NAME']);
                /* 페이지 본문영역 타이틀 넣기 */
                $('.contents_title').text('커뮤니티 : ' + d['BOARD_NAME']);
            }else if(d['BOARD_DOMAIN_ID'] == commName){
                /* 페이지 헤더 타이틀 넣기 */
                $('title').text('커뮤니티 : ' + d['BOARD_NAME']);
            }
            /* 상단메뉴에 게시판 종류 넣기 */
            $('.header_area_wrapper').find('.header_sub_menu')
                .append('<li><a href="/comm/' +d.BOARD_DOMAIN_ID+ '">' +d.BOARD_NAME+ '</a></li>');
        })
    })
}

// 숫자만 입력받기 ( 가입 : 휴대전화번호 )
function checkNumber(check_form){
    var ele =  $('input[name=' + check_form + ']') ;

    var numPattern = /([^0-9])/;
    var numPattern = numPattern.test(ele.val()); // false : 숫자
    if(numPattern){
        alert("숫자만 입력해 주세요!");

        ele.val('');
        ele.select();
        return false;
    }
}

// 공백체크 함수
function checkSpace(str) { 
    if(str.search(/\s/) != -1) {
         return true; 
    } else {
         return false;
     } 
}

// 특수 문자 유무 체크
function checkSpecial(str) {
    var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    if(special_pattern.test(str) == true) { 
        return true; 
    } else {
        return false; 
    } 
}

// 한글포함 여부 채크
function checkKorean(str){
    var korean_pattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if( !korean_pattern.test(str) ){
        return false;
    }else{
        return true;
    }
}

// 6~20자 영문과 숫자조합 아이디 체크
function checkCombination(str){
    var idReg = /^[a-z]+[a-z0-9]{5,19}$/g;
        // 영문과 숫자조합 아님
        if( !idReg.test( str ) ) {
            return false;
        
        // 영문과 숫자조합 맞음
        }else{
            return true;
        }
}



// 서브메뉴
$(".header_main_menu > li > a, .header_sub_menu").hover(function(e){
    $(".header_area_wrapper").stop().animate({"height" : "175px"}, 400, function(){});
    $(".header_sub_menu").removeClass("clocking");
}, function(){
    $(".header_area_wrapper").stop().animate({"height" : "70px"}, 400, function(){});
    $(".header_sub_menu").addClass("clocking");
});

// 로그인
function goLogin(saltKey){

    console.log('goLogin saltKey', saltKey);

    var user = {
        user_id : $("input[name=user_id]").val(),
        user_pw : $("input[name=user_pw]").val()
    }

    console.log("---- :" ,user);

    // 암호화
    var en_user = CryptoJS.AES.encrypt(JSON.stringify(user), saltKey).toString();

    return connectToServer("/login", {user_data : en_user}, "post", function(err, res){
            
        if(err){
            console.log("서버오류 ---> ", err);
            return false;
        }

        //실패
        if(res.error){
            /* 
                [ res.error.errno ]
                1406 ---> Data Too Long
                1054 ---> Bad Sql
                1062 ---> PK 중복
            */
            console.log("DB오류 ---> " + res.error.errno);
            connectToServer("/error", {msg : res.error.code}, "post", function(err, res){
                $('html').html(res);
            });
            return false ;
        }

        // 아이디 불일치
        if(res.data == 1){
            $(".msg_box").html("아이디가 존재하지 않습니다.");
        }

        // 비밀번호 불일치
        if(res.data == -1){
            $(".msg_box").html("비밀번호가 일치하지 않습니다.");
            $("input[name=user_pw]").val("");
            $("input[name=user_pw]").select();
        }

        // 탈퇴한회원
        if(res.data == 2){
            $(".msg_box").html("이미 탈퇴한 회원입니다.");
        }

        // 로그인 성공
        if(res.data == 0){
            location.href="/";
        }

    }); // callback function End
}


// 가입 : 이메일 직접입력 선택 시
function chageMailSelect(){

    var selected_val = $("select[name=user_mail]").val(); 

    // 선택된 값이 직접입력이면 텍스트박스를 보여라
    if(selected_val == "dir_entr"){
        $("input[name=user_mail_dir]").css({"display" : "inline"});

    // 선택된 값이 직접입력이 아니면 텍스트박스를 가려라
    }else{
        $("input[name=user_mail_dir]").css({"display" : "none"});
        $("option[name=dir_entr]").val("dir_entr");
        $("input[name=user_mail_dir]").attr("value", "이메일을 입력하세요") ;
        $("input[name=user_mail_dir]").val("이메일을 입력하세요") ;
    }
}


// 가입 : 직접입력 입력 시
$('input[name=user_mail_dir]').blur(function() { 
    if($('input[name=user_mail_dir]').val() == ""){
        $("input[name=user_mail_dir]").attr("value", "이메일을 입력하세요") ;
        $("input[name=user_mail_dir]").val("이메일을 입력하세요") ;
    }
});

function userMailDirChange(){

    var mail =  $("input[name=user_mail_dir]").val();

    $("option[name=dir_entr]").val(mail);
    $("input[name=user_mail_dir]").attr("value", mail) ;

}

// 유효성 체크 후 공란에 입력되면 안내글을 지운다.
$(".login_contents input[type=text], .login_contents input[type=password], .my_pw_modi_contents input[type=password]").change(function(){
    $(this).siblings("span").html("");
});


/* 회원가입 유효성체크 */
function goJoin(saltKey){

    var user = {
        user_id : $("input[name=user_id]").val(),
        user_pw : $("input[name=user_pw]").val(),
        user_pw_check : $("input[name=user_pw_check]").val(),
        user_name : $("input[name=user_name]").val(),
        
        user_mail_id : $("input[name=user_mail_id]").val(),

        user_phone1 : $("input[name=user_phone1]").val(), 
        user_phone2 : $("input[name=user_phone2]").val(),
        user_phone3 : $("input[name=user_phone3]").val()
    }

    if(user.user_id == ""){
        $("span[name=user_id]").html("아이디를 입력하세요");

    }else if( checkCombination(user.user_id) == false ){
        $("span[name=user_id]").html("아이디는 영문자로 시작하는 6~20자 영문자 또는 숫자이어야 합니다.");

    }else if(user.user_pw == ""){
        $("span[name=user_pw]").html("비밀번호를를 입력하세요");

    }else if(user.user_pw.length < 4 || user.user_pw.length > 10){
        $("span[name=user_pw]").html("비밀번호는 4자 이상 10자 이하 입니다.");

    }else if(checkSpace(user.user_pw) == true){
        $("span[name=user_pw]").html("비밀번호는 공백을 입력할 수 없습니다.");

    }else if(user.user_pw != user.user_pw_check){
        $("span[name=user_pw_check]").html("비밀번호가 일치하지 않습니다.");

    }else if(user.user_name == ""){
        $("span[name=user_name]").html("이름을 입력하세요.");

    }else if(user.user_mail_id == ""){
        $("span[name=user_email]").html("이메일을 입력하세요.");

    }else if( checkKorean(user.user_mail_id) == true || checkSpecial(user.user_mail_id) == true ){
        $("span[name=user_email]").html("잘못된 형식입니다.");

    }else if(user.user_mail_id != "" && $("select[name=user_mail] > option:selected").index() == 4 && $("input[name=user_mail_dir]").val() == "이메일을 입력하세요"){
        $("span[name=user_email]").html("이메일을 입력하세요.");

    }else if(user.user_phone1 == "" || user.user_phone2 == "" || user.user_phone3 == ""){
        $("span[name=user_phone]").html("휴대전화번호를 입력하세요.");

    }else if(id_chk != 1){
        alert("아이디 중복체크를 해주세요.");

    // 유효성 모두 통과한 후
    }else{

        console.log("saltKey ----> ", saltKey);

        if($("select[name=user_mail] > option:selected").index() == 4){
            user.user_email = $("input[name=user_mail_id]").val() + "@" + $("input[name=user_mail_dir]").val();
        }else{
            user.user_email = $("input[name=user_mail_id]").val() + "@" + $("select[name=user_mail]").val();
        }
        user.user_phone =  $("input[name=user_phone1]").val() + $("input[name=user_phone2]").val() + $("input[name=user_phone3]").val();

        console.log("user --> ", user);

        try{
            // 암호화
            var en_user = CryptoJS.AES.encrypt(JSON.stringify(user), saltKey).toString();
        }catch(e){
            if(!saltKey){
                return alert('no Saltkey: 잘못된 접근입니다. 로그인 페이지부터 다시 들어와 주세요.');
            }
            return console.log('catch', e);
        }

        console.log('en_user:', en_user);

        return connectToServer("/join", {user_data : en_user} , "post", function(err, res){
        
            // 성공하면 res.data = 1, 실패하면 res.data = 0
            if(err){
                console.log("서버오류 ---> ", err);
                connectToServer("/error", {msg : err}, "post", function(err, res){
                    $('html').html(res);
                });
                return false;
            }
    
            // 가입실패
            if(res.error){
                /* 
                    [ res.error.errno ]
                    1406 ---> Data Too Long
                    1054 ---> Bad Sql
                    1062 ---> PK 중복
                */
                console.log("DB오류 ---> " + res.error.errno);
                connectToServer("/error", {msg : res.error.code}, "post", function(err, res){
                    $('html').html(res);
                });
                return false ;
            }
    
            // 가입 성공
            if(res.data == 1){
                location.href="/loginPage";
            }
    
        }); // callback function End

    } // else End

    // document.joinForm.submit();

}


/* 가입아이디 중복체크 */
function joinIdDupCheck(){

    var user = {
        user_id : $("input[name=user_id]").val()
    }

    if(user.user_id != ''){

        if(user.user_id.length < 6 || user.user_id.length > 20){
            alert("아이디는 영문자로 시작하는 6~20자 영문자 또는 숫자이어야 합니다.");
            $(".login_contents input[name='user_id']").focus();
    
        }else if( checkCombination(user.user_id) == false ){
            alert("아이디는 영문자로 시작하는 6~20자 영문자 또는 숫자이어야 합니다.");
            $(".login_contents input[name='user_id']").focus();
    
        }else if(checkSpace(user.user_id) == true ){
            // 띄어쓰기 포함되어있음
            alert("아이디는 공백을 입력할 수 없습니다.");
            $(".login_contents input[name='user_id']").focus();
    
        }else if(checkSpecial(user.user_id) == true){
            // 특수문자 포함되어있음
            alert("아이디는 특수문자를 사용할 수 없습니다.");
            $(".login_contents input[name='user_id']").focus();
            
        }else{

            return connectToServer("/idCheck", user, "post", function(err, res){
                
                // 중복이면 res.data = 1, 중복아니면 res.data = 0
                if(err){
                    console.log("서버오류 ---> ", err);
                    return false;
                }

                // 확인실패
                if(res.error){
                    /* 
                        [ res.error.errno ]
                        1406 ---> Data Too Long
                        1054 ---> Bac Sql
                        1062 ---> PK 중복
                    */
                    console.log("DB오류 ---> " + res.error.errno);
                    connectToServer("/error", {msg : res.error.code}, "post", function(err, res){
                        $('html').html(res);
                        return false ;
                    });
                }

                console.log("res.data -----> ", res.data);
                // 중복된아이디
                if(res.data == 1){
                    alert("아이디가 중복되었습니다");
                
                // 중복되지 않은 아이디
                }else{
                    alert("사용가능한 아이디입니다.");
                    id_chk = 1;
                    
                }

            }); // callback function End
        }
    } //  if End
} // joinIdDupCheck End



// 정보수정하기 페이지이동
function goModiMyInfoPage(saltKey){

    console.log("saltKey-->",saltKey);

    var user_pw = $("input[name=user_pw]").val() ;
    console.log("user_pw-->",user_pw);

    // 암호화
    var en_user = CryptoJS.AES.encrypt(user_pw, saltKey).toString();

    return connectToServer("/mypage", {user_pw : en_user}, "post", function(err, res){
            
        if(err){
            console.log("서버오류 ---> ", err);
            return false;
        }

        //실패
        if(res.error){
            /* 
                [ res.error.errno ]
                1406 ---> Data Too Long
                1054 ---> Bad Sql
                1062 ---> PK 중복
            */
            console.log("DB오류 ---> " + res.error.errno);
            return false ;
        }

        // 비밀번호 일치 
        if(res.data == true){
            location.href="/myModi";

        // 비밀번호 불일치
        }else{
            $(".passsword_error_messege").html("비밀번호가 일치하지 않습니다.");
        }

    }); // callback function End

} // goModiMyInfo End


//비밀번호 변경
function goChangePassword(saltKey){
    console.log('goChangePassword saltKey:', saltKey);
    var user = {
        new_user_pw : $("input[name=new_user_pw]").val(),
        new_user_pw_ckh : $("input[name=new_user_pw_ckh]").val()
    }

    // 새로운 비밀번호 유효성검사
    if(user.new_user_pw == ""){
        $("span[name=new_user_pw]").html("비밀번호를 입력하세요");

    }else if(user.new_user_pw_ckh == ""){
        $("span[name=new_user_pw_ckh]").html("비밀번호를 한번 더 입력하세요");

    }else if(user.new_user_pw.length < 4 || user.new_user_pw.length > 10){
        $("span[name=new_user_pw]").html("비밀번호는 4자 이상 10자 이하 입니다.");

    }else if(checkSpace(user.new_user_pw) == true){
        $("span[name=new_user_pw]").html("비밀번호는 공백을 입력할 수 없습니다.");

    }else if(user.new_user_pw != user.new_user_pw_ckh){
        $("span[name=new_user_pw_ckh]").html("비밀번호가 일치하지 않습니다.");

    // 유효성 통과
    }else{ 
        
        // 암호화
        var en_user_new_pw = CryptoJS.AES.encrypt(JSON.stringify(user.new_user_pw), saltKey).toString();

        console.log('en_user_new_pw:', en_user_new_pw);

        return connectToServer("/changePw",  {user_data : en_user_new_pw} , "post", function(err, res){
        
            if(err){
                console.log("서버오류 ---> ", err);
                return false;
            }
    
            // 실패
            if(res.error){
                /* 
                    [ res.error.errno ]
                    1406 ---> Data Too Long
                    1054 ---> Bad Sql
                    1062 ---> PK 중복
                */
                console.log("DB오류 ---> " + res.error.errno);
                return false ;
            }
    
            // 성공
            if(res.data == true){
                alert("비밀번호 변경이 완료되었습니다. 로그인 해주세요.");
                location.href="/loginPage";
            }
    
        }); // callback function End
    }

    //return false;
}

// 회원탈퇴
function goWithdrawal(){

    var rs = $("input[name='withdrawal_reasons']:checked").val();

    if(rs == ''){      

        alert("사유가 선택되지 않았습니다.");

        return false;

    }else{
        return connectToServer("/withdrawal",  {user_data : rs} , "post", function(err, res){
            
            if(err){
                console.log("서버오류 ---> ", err);
                return false;
            }

            // 실패
            if(res.error){
                /* 
                    [ res.error.errno ]
                    1406 ---> Data Too Long
                    1054 ---> Bad Sql
                    1062 ---> PK 중복
                */
                console.log("DB오류 ---> " + res.error.errno);
                return false ;
            }

            // 성공
            if(res.data == true){
                alert("이용해 주셔서 감사합니다.");
                location.href="/logout";
            }

        }); // callback function End
    }
}

// 내 정보 수정
function goModiMyInfoModi(){

    var user_data = {
        user_name : $("input[name='user_name']").val()
    };

    if($("select[name=user_mail] > option:selected").index() == 4){
        user_data.user_email = $("input[name=user_email]").val() + "@" + $("input[name=user_mail_dir]").val();

    }else{
        user_data.user_email = $("input[name=user_email]").val() + "@" + $("select[name=user_mail]").val();
        console.log("jn");
    }
    user_data.user_phone =  $("input[name=user_phone1]").val() + $("input[name=user_phone2]").val() + $("input[name=user_phone3]").val();

    console.log("user_data ---> ", user_data);

    return connectToServer("/myModi",  {user_data : user_data} , "post", function(err, res){
            
        if(err){
            console.log("서버오류 ---> ", err);
            return false;
        }

        // 실패
        if(res.error){
            /* 
                [ res.error.errno ]
                1406 ---> Data Too Long
                1054 ---> Bad Sql
                1062 ---> PK 중복
            */
            console.log("DB오류 ---> " + res.error.errno);
            return false ;
        }
        // 성공
        if(res.data == true){
            alert("정보가 수정되었습니다.");
            location.href="/";
        }
    }); // callback function End
}

/* 댓글 작성하기
    @writer : 글쓴이
    @comm_name : 게시판 테이블종류
    @comm_id : 게시물 ID
*/
function submitComment(writer, comm_name, comm_id){
    var commentContent = $('.comm_comment_write_area').find('textarea').val();
    if(commentContent.length == 0){
        alert('댓글 내용이 입력되지 않았습니다.');
        return;
    }
    /* 확인 창 */
    if (!confirm("해당 내용으로 댓글 작성 하실거에요?")){
        return;
    }
    
    
    출처: http://h5bak.tistory.com/134 [이준빈은 호박머리]
    var content = {
        commName: comm_name,
        commId: comm_id,
        writer : writer,
        content : $('.comm_comment_write_area').find('textarea').val(),
        date : new Date()
    }

    console.log("submitComment content:" ,content);

    return connectToServer("/comm_comment_submit", content, "post", function(err, res){
            
        if(err){
            console.log("서버오류 ---> ", err);
            return false;
        }

        //실패
        if(res.error){
            /* 
                [ res.error.errno ]
                1406 ---> Data Too Long
                1054 ---> Bad Sql
                1062 ---> PK 중복
            */
            console.log("DB오류 ---> " + res.error.errno);
            return false ;
        }
        /* 댓글 작성 후 input text 내용 삭제하기 */
        $('#comm_view_table > tbody > tr.comm_comment_area > td > div.comm_comment_write_area > textarea').val('');

        renderComment(writer, comm_name, comm_id, res); /* 서버로부터 받아온 댓글리스트 뷰에 렌더링하기 */

    }); // callback function End
}
/* 댓글 목록보기
    @authId : 현재 로그인한 계정
    @comm_name : 게시판 테이블종류
    @comm_id : 게시물 ID
*/
function listComment(authId, comm_name, comm_id){
    var content = {
        commId: comm_id,
    }
    
    return connectToServer("/comm_comment_view", content, "post", function(err, res){
            
        if(err){
            console.log("서버오류 ---> ", err);
            return false;
        }

        //실패
        if(res.error){
            /* 
                [ res.error.errno ]
                1406 ---> Data Too Long
                1054 ---> Bad Sql
                1062 ---> PK 중복
            */
            console.log("DB오류 ---> " + res.error.errno);
            return false ;
        }

        console.log('listComment success', res);
        renderComment(authId, comm_name, comm_id, res); /* 서버로부터 받아온 댓글리스트 뷰에 렌더링하기 */

    }); // callback function End
}
/* 서버로부터 받아온 댓글리스트 뷰에 렌더링하기 
    @authId : 현재 로그인한 계정
    @comm_name : 게시판 테이블종류
    @comm_id : 게시물 ID
    @commentlist : 서버로부터 받은 댓글 리스트 (배열형태)
*/
function renderComment(authId, comm_name, comm_id, commentlist){
    /* 댓글 리스트 배열형태로 나오는데, 이것을 loop문을 통해서 html로 조립 */
    /* 아직 다른 테이블에 대한 동적 컬럼명 할당은 구현 안 한 상태. */
    var commentdoms = commentlist.map(function(d,i){
        if(authId != d.USER_ID){
            return '<div class="comm_comment_row" id="'+d.COMMENT_ID+'">'+
                '<div class="comm_comment_writer">'+d.USER_ID+'</div>'+
                '<div class="comm_comment_date">'+d.DATE+'</div>'+
                '<div class="comm_comment_content">'+d.CONTENT+'</div>'
            '</div>';
        }else{
            return '<div class="comm_comment_row" id="'+d.COMMENT_ID+'">'+
                '<div class="comm_comment_writer">'+d.USER_ID+'</div>'+
                '<div class="comm_comment_date">'+d.DATE+'</div>'+
                '<div class="comm_comment_content">'+d.CONTENT+'</div>'+
                '<div class="comm_comment_delete fa fa-trash fa-lg" onClick="removeComment(\''+authId+'\',\''+comm_name+'\',\''+comm_id+'\',\''+d.COMMENT_ID+'\')"></div>'+
                '<div class="comm_comment_modify fa fa-edit fa-lg" onClick=""></div>'+
            '</div>';
        }
    });
    /* 댓글 html영역에 기존 것 없애고 최신상태 댓글리스트 DOM 추가하기 */
    $('.comm_comment_area').find('td').children('.comm_comment_row').remove();
    $('.comm_comment_area').find('td').append(commentdoms.join(''))
        .find('.comm_comment_modify').on('click', function(e){
            /* 수정하기 버튼 눌렀을 때 자식으로 input과 button이 생긴다 */
            var content = $(e.target).siblings('.comm_comment_content').text();
            $(e.target).siblings('.comm_comment_content').text('').append('<textarea rows="4">'+content+'</textarea><button class="submit">제출</button><button class="cancel">취소</button>')
                .each(function(i,d){    /* 현 상태에서의 .each : append이후 시점에 대한 이벤트를 주고 싶을때 사용 */
                    /* 제출 버튼 눌렀을때의 클릭이벤트 */
                    $(d).find('button.submit').on('click', function(e){
                        var commentId = $(e.target).parents('.comm_comment_row').attr('id');
                        var commentContent = $(e.target).siblings('textarea').val();
                        console.log('submit commentContent', commentContent);
                        /* 댓글 수정하기 메소드로 이동 */
                        modifyComment(authId, comm_name, comm_id, commentId, commentContent)
                    });
                    /* 취소 버튼 눌렀을때의 클릭이벤트 */
                    $(d).find('button.cancel').on('click', function(e){
                        /* 상태 원상복귀 */
                        $(e.target).parents('.comm_comment_content').text(content).children().remove();
                    });
                });
        });
}

/* 댓글 삭제하기 
    @authId : 현재 로그인한 계정
    @comm_name : 게시판 테이블종류
    @comm_id : 게시물 ID
    @commentId : 제거하고자 하는 댓글번호
*/
function removeComment(authId, comm_name, comm_id, commentId){
    /* 확인 창 */
    if (!confirm("정말 댓글 삭제 하실거에요?")){
        return;
    }
    var content = {
        commName: comm_name,
        commentId: commentId,
        commId: comm_id
    }
    
    return connectToServer("/comm_comment_del", content, "post", function(err, res){
            
        if(err){
            console.log("서버오류 ---> ", err);
            return false;
        }

        //실패
        if(res.error){
            /* 
                [ res.error.errno ]
                1406 ---> Data Too Long
                1054 ---> Bad Sql
                1062 ---> PK 중복
            */
            console.log("DB오류 ---> " + res.error.errno);
            return false ;
        }

        console.log('removeComment success', res);
        renderComment(authId, comm_name, comm_id, res); /* 서버로부터 받아온 댓글리스트 뷰에 렌더링하기 */
    });
}
/* 댓글 수정하기 
    @authId : 현재 로그인한 계정
    @comm_name : 게시판 테이블종류
    @comm_id : 게시물 ID
    @commentId : 제거하고자 하는 댓글번호
    @commentContent : 수정하고자하는 댓글내용
*/
function modifyComment(authId, comm_name, comm_id, commentId, commentContent){
    /* 확인 창 */
    if (!confirm("해당 내용으로 댓글 수정 하실거에요?")){
        return;
    }
    var content = {
        commName: comm_name,
        commId: comm_id,
        commentId: commentId,
        commentContent: commentContent
    }
    
    return connectToServer("/comm_comment_modify", content, "post", function(err, res){


        if(err){
            console.log("서버오류 ---> ", err);
            return false;
        }

        //실패
        if(res.error){
            /* 
                [ res.error.errno ]
                1406 ---> Data Too Long
                1054 ---> Bad Sql
                1062 ---> PK 중복
            */
            console.log("DB오류 ---> " + res.error.errno);
            return false ;
        }

        console.log('removeComment success', res);
        renderComment(authId, comm_name, comm_id, res); /* 서버로부터 받아온 댓글리스트 뷰에 렌더링하기 */
    });
}

/*Ajax 통신을 위한 펑션 */
function connectToServer(url, data, method, callback){
    $.ajax({
        url: url,
        data: JSON.stringify((data)?data:''),
        type: method,
        contentType: 'application/json',
        success: function(data, status){
            callback(null, data);
        },
        timeout: 10000,

        error: function(data, status, errthrown){
            console.log('[error]data', data);
            console.log('[error]status', status);
            console.log('[error]err thrown', errthrown);
            if(data.status == 400){
                if(data.responseText != undefined){
                    callback(data.responseText.replace(/(\n|\r\n)/g, '<br>'), null);
                }else{
                    callback(data.responseJSON.replace(/(\n|\r\n)/g, '<br>'), null)
                }
            }else if(status == 'timeout'){
                callback('서버응답시간을 초과하였습니다.', null)
            }else if(status == 'error'){
                callback('서버로부터 에러가 발생되었습니다.', null)
            }
        }
    });
} // ajax E
