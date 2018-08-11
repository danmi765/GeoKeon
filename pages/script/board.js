
/**
 * @author geoseong
 * @description 게시판 팝업 내용 변경하고 띄우기
 * @param {string} title 
 * @param {string} message 
 * @param {function} callback 
 */
function loadCommPopup(title, message, callback){
    var popupDom = $('.comm-popup-wrapper');
    /* 기존의 에러메시지와 입력값 초기화시키기 */
    popupDom.find('.comm-popup-header').text('');
    popupDom.find('.comm-popup-input').val('');
    popupDom.find('.comm-popup-errmsg').text('');
    /* 팝업 헤더에 제목 넣기 */
    popupDom.find('.comm-popup-header').text(title);
    /* 팝업에 메시지 넣기 */
    popupDom.find('.comm-popup-message').text(message);
    /* 팝업 비추기 */
    popupDom.removeClass('gk-clocking');
    /* 스크롤 막기 */
    $('body').addClass('contets_wrapper');
}


/**
 * @author geoseong   
 * @description 게시판 팝업 에러메시지 세팅 후 비추기
 * @param {string} message 
 * @param {Function} callback 
 */
function setCommPopupError(message, callback){
    var popupDom = $('.comm-popup-wrapper');
    var errmsgDom = popupDom.find('.comm-popup-errmsg');
    errmsgDom.text(message);
    callback(false);
}


/**
 * @author geoseong
 * @description 게시판 팝업 감추기
 * @param {Function} callback 
 */
function unloadCommPopup(callback){
    var popupDom = $('.comm-popup-wrapper');
    /* 팝업 감추기 */
    popupDom.addClass('gk-clocking');
    /* 스크롤 막기 해제 */
    $('body').removeClass('contets_wrapper');
}


/**
 * @author geoseong
 * @description 댓글 작성하기
 * @param {string} writer 
 * @param {string} comm_name 
 * @param {string} comm_id 
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


/**
 * @author geoseong
 * @description 댓글 목록보기
 * @param {string} authId 
 * @param {string} comm_name 
 * @param {string} comm_id 
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


/**
 * @author geoseong
 * @description 댓글리스트 렌더링
 * @param {string} authId 
 * @param {string} comm_name 
 * @param {string} comm_id 
 * @param {string} commentlist 
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


/**
 * @author geoseong
 * @description 댓글 삭제하기
 * @param {string} authId 
 * @param {string} comm_name 
 * @param {string} comm_id 
 * @param {string} commentId 
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


/**
 * @author geoseong
 * @description 댓글 수정하기
 * @param {string} authId 
 * @param {string} comm_name 
 * @param {string} comm_id 
 * @param {string} commentId 
 * @param {string} commentContent 
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

