module.exports = {
    'select' : {
        'list_comm_board' : 'SELECT BOARD.*, CNT.COUNT FROM ?? BOARD, (SELECT COUNT(??) as COUNT FROM ??) CNT ORDER BY ?? DESC LIMIT ?, ?',
        'search_comm_board' : 'SELECT BOARD.*, CNT.COUNT FROM ?? BOARD, (SELECT COUNT(??) as COUNT FROM ?? WHERE ?? LIKE ?) CNT WHERE ?? LIKE ? ORDER BY ? DESC LIMIT ?, ?',
        'list_portpolio' : 'SELECT * FROM PORTPOLIO',
        'get_comm_board' : 'SELECT * FROM ?? WHERE ?? = ?',
        'get_user_id' : 'SELECT * FROM GK_USERS WHERE GK_USERS_ID = ? '
    },
    'insert' : {
        'add_comm_inquiry_board' : 'INSERT INTO BOARD_INQUIRY (BOARD_INQUIRY_TITLE, BOARD_INQUIRY_CONTENT, BOARD_INQUIRY_PW, BOARD_INQUIRY_WRITER, BOARD_INQUIRY_DATE) VALUES ?',
        'add_comm_notice_board' : 'INSERT INTO BOARD_NOTICE (BOARD_NOTICE_TITLE, BOARD_NOTICE_CONTENT, BOARD_NOTICE_WRITER, BOARD_NOTICE_DATE) VALUES ?',
        'add_user' : 'INSERT INTO GK_USERS (GK_USERS_ID, GK_USERS_PW, GK_USERS_NAME, GK_USERS_EMAIL, GK_USERS_PHONE, GK_USERS_DATE, GK_USERS_STATUS) VALUES (?, ?, ?, ?, ?, ?, ?)'
    },
    'delete' : {
        'delete_comm_board' : 'DELETE FROM ?? WHERE ?? = ?'
    },
    'update' : {
        'update_comm_inquiry_board' : 'UPDATE BOARD_INQUIRY SET BOARD_INQUIRY_TITLE = ?,BOARD_INQUIRY_CONTENT=? WHERE BOARD_INQUIRY_ID=?',
        'update_comm_notice_board' : 'UPDATE BOARD_NOTICE SET BOARD_NOTICE_TITLE = ?, BOARD_NOTICE_CONTENT=? WHERE BOARD_NOTICE_ID=?',

        'update_comm_inquiry_board_cnt_p': 'UPDATE BOARD_INQUIRY SET BOARD_INQUIRY_CNT = ? WHERE BOARD_INQUIRY_ID = ?',
        'update_comm_notice_board_cnt_p': 'UPDATE BOARD_NOTICE SET BOARD_NOTICE_CNT = ? WHERE BOARD_NOTICE_ID = ?'
        // UPDATE board_inquiry a, board_inquiry b SET a.BOARD_INQUIRY_CNT = b.BOARD_INQUIRY_CNT+1 WHERE a.BOARD_INQUIRY_ID = b.BOARD_INQUIRY_ID and a.BOARD_INQUIRY_ID = ? ===> select문 없이 update하기
    }
}
