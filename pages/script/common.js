

var joins; // 암호화를 위함 key


loadBoardDomainList();  // (로드 될때마다 실행)게시판 목록 불러오기


// delete, insert, update 쿼리 row가 0일 때 에러창 띄움
if(queryError == "f" ){
    $(".qe_wrapper").css("display", "flex");
    $(".qe_box").css("opacity", "0");

    $(".qe_box").stop().animate({"opacity" : "1"}, 1000, function(){
        $(".qe_box").stop().animate({"opacity" : "0"}, 500, function(){
            $(".qe_wrapper").css("display", "none");
        });
    });
}


/**
 * @author 배건희
 * @description 서브메뉴 드롭다운
 */
var ul_height, height;
$(".header_main_menu > li > a, .header_sub_menu").hover(function(e){
    ul_height = $(".header_sub_menu").height();
    height = Number(ul_height)+50 ;
    $(".header_area_wrapper").stop().animate({"height" : height+"px"}, 400, function(){});
    $(".header_sub_menu").removeClass("gk-clocking");
}, function(){
    $(".header_area_wrapper").stop().animate({"height" : "50px"}, 400, function(){});
    $(".header_sub_menu").addClass("gk-clocking");
});


/**
 * @author 박태성
 * @description 게시판목록을 불러옴.
 * @param {} param 
 */
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


/**
 * @author 배건희
 * @description 문자열이  숫자로만 이루어져있지 않으면 확인한여 경고창을 띄움.
 * @param {string} check_form 
 */
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


/**
 * @author 배건희  
 * @description 문자열에 공백이 포함되었는지 확인하여 true/false를 반환함
 * @param {string} str 
 */
function checkSpace(str) { 
    if(str.search(/\s/) != -1) {
         return true; 
    } else {
         return false;
     } 
}


/**
 * @author 배건희
 * @description 문자열에 특수문자가 포함되었는지 확인하여 true/false를 반환함
 * @param {string} str 
 */
function checkSpecial(str) {
    var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    if(special_pattern.test(str) == true) { 
        return true; 
    } else {
        return false; 
    } 
}


/**
 * @author 배건희
 * @description 문자열에 한글이 포함되었는지 확인하여 true/false를 반환함
 * @param {string} str 
 */
function checkKorean(str){
    var korean_pattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if( !korean_pattern.test(str) ){
        return false;
    }else{
        return true;
    }
}


/**
 * @author 배건희
 * @description 문자열이 6자이상,20자이하의 영문과 숫자만의조합으로 이루어졌는지 확인하여 true/false를 반환함
 *              회원가입 아이디 유효성검사
 * @param {string} str 
 */
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