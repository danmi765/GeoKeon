var id_chk = 0; // 아이디 중복체크 유효성 검사용 변수
var joins; // 암호화를 위함 key

// 공백체크 함수
function checkSpace(str) { 
    if(str.search(/\s/) != -1) {
         return true; 
    } else {
         return false;
     } 
}

// 특수 문자가 있나 없나 체크
function checkSpecial(str) {
    var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    if(special_pattern.test(str) == true) { 
        return true; 
    } else {
        return false; 
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

    console.log(saltKey);

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
            return false ;
        }

        // 아이디 불일치
        if(res.data == 1){
            $(".msg_box").html("아이디가 존재하지 않습니다.");
        }

        // 비밀번호 불일치
        if(res.data == -1){
            $(".msg_box").html("비밀번호가 일치하지 않습니다.");
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
$(".login_contents input[type=text], .login_contents input[type=password]").change(function(){
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

    }else if(user.user_id.length < 5 || user.user_id.length > 10){
        $("span[name=user_id]").html("아이디는 5자 이상 10자 이하 입니다.");

    }else if(checkSpace(user.user_id) == true ){
        // 띄어쓰기 포함되어있음
        $("span[name=user_id]").html("아이디는 공백을 입력할 수 없습니다.");

    }else if(checkSpecial(user.user_id) == true){
        // 특수문자 포함되어있음
        $("span[name=user_id]").html("아이디는 특수문자를 사용할 수 없습니다.");
        
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
            console.log("jn");
        }
        user.user_phone =  $("input[name=user_phone1]").val() + $("input[name=user_phone2]").val() + $("input[name=user_phone3]").val();

        console.log("user --> ", user);

        // 암호화
        var en_user = CryptoJS.AES.encrypt(JSON.stringify(user), saltKey).toString();

        console.log('en_user:', en_user);

        return connectToServer("/join", {user_data : en_user} , "post", function(err, res){
        
            // 성공하면 res.data = 1, 실패하면 res.data = 0
            if(err){
                console.log("서버오류 ---> ", err);
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
                return false ;
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
    } //  if End
} // joinIdDupCheck End



// 정보수정하기 페이지이동
function goModiMyInfoPage(saltKey){

    var user_pw = $("input[name=user_pw]").val() ;

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
            alert(res.msg);
        }

    }); // callback function End

} // goModiMyInfo End


/*Ajax 통신을 위한 펑션 */
function connectToServer(url, data, method, callback){
    console.log('[connectToServer]url:', url);
    console.log('[connectToServer]data:', data);


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


