var id_chk = 0; // 아이디 중복체크 유효성 검사용 변수

// 회원탈퇴박스 가리기
$(".reasons_box").hide();

// 직접입력 input창이 공백이면 '이메일을입력하세요'를 띄움
$('input[name=user_mail_dir]').blur(function() { 
    if($('input[name=user_mail_dir]').val() == ""){
        $("input[name=user_mail_dir]").attr("value", "이메일을 입력하세요") ;
        $("input[name=user_mail_dir]").val("이메일을 입력하세요") ;
    }
});

// 유효성 체크 후 공란에 입력되면 안내글을 지운다.
$(".login_contents input[type=text], .login_contents input[type=password], .my_pw_modi_contents input[type=password]").change(function(){
    $(this).siblings("span").html("");
});


/**
 * @author 배건희
 * @description 로그인
 * @param {string} saltKey 
 */
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


/**
 * @author 배건희
 * @description 가입페이지 이메일직접입력 선택 시 input박스 활성화
 */
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


/**
 * @author 배건희
 * @description 이메일직접입력 입력 시 <option>과 <input>의 속성value 설정
 */
function userMailDirChange(){

    var mail =  $("input[name=user_mail_dir]").val();

    $("option[name=dir_entr]").val(mail);
    $("input[name=user_mail_dir]").attr("value", mail) ;

}


/**
 * @author 배건희
 * @description 회원가입 유효성체크
 * @param {string} saltKey 
 */
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


/**
 * @author 배건희
 * @description 가입아이디 중복체크
 */
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


/**
 * @author 배건희
 * @description 마이페이지 정보수정 페이지로 이동
 * @param {string} saltKey 
 */
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


/**
 * @author 배건희
 * @description 마이페이지 정보수정
 */
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


/**
 * @author 배건희
 * @description 마이페이지 비밀번호변경
 * @param {string} saltKey 
 */
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


/**
 * @author 배건희
 * @description 마이페이지 회원탈퇴
 */
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

