module.exports = {
    'select' : {
        'list_comm_board' : 'SELECT BOARD.*, CNT.COUNT FROM ?? BOARD, (SELECT COUNT(??) as COUNT FROM ??) CNT ORDER BY ?? DESC LIMIT ?, ?',
        'search_comm_board' : 'SELECT BOARD.*, CNT.COUNT FROM ?? BOARD, (SELECT COUNT(??) as COUNT FROM ?? WHERE ?? LIKE ?) CNT WHERE ?? LIKE ? ORDER BY ? DESC LIMIT ?, ?',
        'list_portpolio' : 'SELECT * FROM PORTPOLIO',
        'get_comm_board' : 'SELECT * FROM ?? WHERE ?? = ?',
        'get_user_id' : 'SELECT * FROM GK_USERS WHERE USER_ID = ?',
        'get_user_id_for_email' : "SELECT CONCAT( SUBSTR( USER_ID, 1, LENGTH(USER_ID)-3 ), '***' ) AS USER_ID FROM GK_USERS WHERE USER_EMAIL = ?",
        'get_user_pw_for_user_id' : 'SELECT GK_USERS_PW FROM GK_USERS WHERE GK_USERS_ID = ?',
        'get_comment_list' : 'SELECT * FROM ?? WHERE ?? = ? ORDER BY ?? DESC'
    },
    'insert' : {
        'add_comm_inquiry_board' : 'INSERT INTO BOARD_INQUIRY (BOARD_INQUIRY_TITLE, BOARD_INQUIRY_CONTENT, BOARD_INQUIRY_PW, BOARD_INQUIRY_WRITER, BOARD_INQUIRY_DATE) VALUES ?',
        'add_comm_notice_board' : 'INSERT INTO BOARD_NOTICE (BOARD_NOTICE_TITLE, BOARD_NOTICE_CONTENT, BOARD_NOTICE_WRITER, BOARD_NOTICE_DATE) VALUES ?',
        'add_user' : 'INSERT INTO GK_USERS (`USER_ID`, `USER_PW`, `USER_NAME`, `USER_PHONE`, `USER_EMAIL`, `JOIN_DATE`, `STATUS`) VALUES (? , ? , ? , ? , ? , ? , ?)',
        'add_comment' : 'INSERT INTO ?? (??, ??, ??, ??) VALUES (?, ?, ?, ?)'
    },
    'delete' : {
        'delete_comm_board' : 'DELETE FROM ?? WHERE ?? = ?'
    },
    'update' : {
        'update_comm_inquiry_board' : 'UPDATE BOARD_INQUIRY SET BOARD_INQUIRY_TITLE = ?,BOARD_INQUIRY_CONTENT=? WHERE BOARD_INQUIRY_ID=?',
        'update_comm_notice_board' : 'UPDATE BOARD_NOTICE SET BOARD_NOTICE_TITLE = ?, BOARD_NOTICE_CONTENT=? WHERE BOARD_NOTICE_ID=?',

        'update_comm_inquiry_board_cnt_p': 'UPDATE BOARD_INQUIRY SET BOARD_INQUIRY_CNT = ? WHERE BOARD_INQUIRY_ID = ?',
        'update_comm_notice_board_cnt_p': 'UPDATE BOARD_NOTICE SET BOARD_NOTICE_CNT = ? WHERE BOARD_NOTICE_ID = ?',
        // UPDATE board_inquiry a, board_inquiry b SET a.BOARD_INQUIRY_CNT = b.BOARD_INQUIRY_CNT+1 WHERE a.BOARD_INQUIRY_ID = b.BOARD_INQUIRY_ID and a.BOARD_INQUIRY_ID = ? ===> select문 없이 update하기
        'update_user_pw' : 'UPDATE GK_USERS SET USER_PW = ? WHERE USER_ID = ? ',
        'update_comment_inquiry' : 'UPDATE COMMENT_INQUIRY SET COMMENT_INQUIRY_CONTENT = ? WHERE COMMENT_INQUIRY_ID = ?',
        'update_user_login_dt' : 'UPDATE GK_USERS SET LOGIN_DATE= ? WHERE USER_ID= ? ',
        'update_user_withdtawal' : 'UPDATE GK_USERS SET GK_USERS_STATUS = ? , GK_USERS_WITHDRAWAL_REASON = ? WHERE GK_USERS_ID = ?',
        'update_user_info' : 'UPDATE GK_USERS SET GK_USERS_NAME = ?, GK_USERS_PHONE = ? , GK_USERS_EMAIL = ? WHERE GK_USERS_ID = ?'
    }
}
