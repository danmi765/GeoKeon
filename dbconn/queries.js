module.exports = {
    'select' : {
        /* 게시글이 하나도 없을 때 처리쿼리 필요 */
        // 'list_comm_board' : `SELECT BOARD.BOARD_ID, BOARD.TITLE, BOARD.CONTENT, BOARD.PASSWORD, BOARD.DATE, BOARD.HITS, BOARD.USER_ID, BOARD.BOARD_DOMAIN_ID FROM BOARD WHERE BOARD_DOMAIN_ID = ? ORDER BY DATE DESC`,
        'list_comm_board' : `
            SELECT
                T.PAGE, T.BOARD_ID, T.TITLE, T.CONTENT, T.DATE, T.HITS, T.USER_ID, T.BOARD_DOMAIN_ID, T.ROWNUM
            FROM (
                SELECT 
                    CEILING( A.ROWNUM / 10 ) AS PAGE, 
                    A.BOARD_ID, A.TITLE, A.CONTENT, A.DATE, A.HITS, A.USER_ID, A.BOARD_DOMAIN_ID, A.ROWNUM
                FROM (
                        SELECT 
                            BOARD.BOARD_ID, BOARD.TITLE, BOARD.CONTENT, 
                            BOARD.DATE, BOARD.HITS, 
                            BOARD.USER_ID, BOARD.BOARD_DOMAIN_ID,
                            @RNUM := @RNUM + 1 AS ROWNUM
                        FROM (SELECT * FROM BOARD ORDER BY DATE ASC) BOARD, (SELECT @RNUM :=0 ) AS R
                        WHERE BOARD.BOARD_DOMAIN_ID = ?
                ) A 
            ) T
            WHERE T.PAGE = ?
            ORDER BY T.ROWNUM DESC
        `,
        // 'search_comm_board' : 'SELECT BOARD.*, CNT.COUNT FROM ?? BOARD, (SELECT COUNT(??) as COUNT FROM ?? WHERE ?? LIKE ?) CNT WHERE ?? LIKE ? ORDER BY ? DESC LIMIT ?, ?',
        'search_comm_board' : `
            SELECT
                T.PAGE, T.BOARD_ID, T.TITLE, T.CONTENT, T.DATE, T.HITS, T.USER_ID, T.BOARD_DOMAIN_ID, T.ROWNUM
            FROM (
                SELECT 
                    CEILING( A.ROWNUM / 10 ) AS PAGE, 
                    A.BOARD_ID, A.TITLE, A.CONTENT, A.DATE, A.HITS, A.USER_ID, A.BOARD_DOMAIN_ID, A.ROWNUM
                FROM (
                        SELECT 
                            BOARD.BOARD_ID, BOARD.TITLE, BOARD.CONTENT, 
                            BOARD.DATE, BOARD.HITS, 
                            BOARD.USER_ID, BOARD.BOARD_DOMAIN_ID,
                            @RNUM := @RNUM + 1 AS ROWNUM
                        FROM (SELECT * FROM BOARD ORDER BY DATE ASC) BOARD, (SELECT @RNUM :=0 ) AS R
                        WHERE BOARD.BOARD_DOMAIN_ID = ?
                ) A 
            ) T
            WHERE T.PAGE = ?
            ORDER BY T.ROWNUM DESC
        `,
        'list_portfolio' : 'SELECT * FROM PORTFOLIO',
        'get_comm_board' : 'SELECT * FROM BOARD WHERE BOARD_ID = ?',
        'get_comm_board_for_user_id' : 'SELECT BOARD.*, BOARD_DOMAIN.BOARD_NAME FROM BOARD, BOARD_DOMAIN WHERE BOARD.BOARD_DOMAIN_ID = BOARD_DOMAIN.BOARD_DOMAIN_ID AND USER_ID = ? ORDER BY DATE DESC',
        'get_user_id' : 'SELECT * FROM GK_USERS WHERE USER_ID = ?',
        'get_user_id_for_email' : "SELECT CONCAT( SUBSTR( USER_ID, 1, LENGTH(USER_ID)-3 ), '***' ) AS USER_ID FROM GK_USERS WHERE USER_EMAIL = ?",
        'get_user_pw_for_user_id' : 'SELECT USER_PW FROM GK_USERS WHERE USER_ID = ?',
        'get_comment_list' : 'SELECT * FROM COMMENT WHERE BOARD_ID = ? ORDER BY DATE DESC',
        'get_comment_list_for_user_id' : 'SELECT COMMENT.*, BOARD.TITLE FROM COMMENT, BOARD WHERE COMMENT.BOARD_ID = BOARD.BOARD_ID AND COMMENT.USER_ID = ? ORDER BY DATE DESC',
        'get_board_domain_list' : 'SELECT * FROM BOARD_DOMAIN'
    },
    'insert' : {
        'add_board_post' : 'INSERT INTO board (`TITLE`, `CONTENT`, `PASSWORD`, `DATE`, `HITS`, `USER_ID`, `BOARD_DOMAIN_ID`) VALUES (?, ?, ?, ?, ?, ?, ? )',
        'add_user' : 'INSERT INTO GK_USERS (`USER_ID`, `USER_PW`, `USER_NAME`, `USER_PHONE`, `USER_EMAIL`, `JOIN_DATE`, `STATUS`) VALUES (? , ? , ? , ? , ? , ? , ?)',
        'add_comment' : 'INSERT INTO COMMENT (`CONTENT`, `DATE`, `USER_ID`, `BOARD_ID`) VALUES (?, ?, ?, ?)'
    },
    'delete' : {
        'delete_comm_board' : 'DELETE FROM BOARD WHERE BOARD_ID = ? AND PASSWORD = ?',
        'delete_comment' : 'DELETE FROM COMMENT WHERE COMMENT_ID = ?'
    },
    'update' : {
        'update_board_content' : 'UPDATE BOARD SET TITLE=?,   CONTENT= ? WHERE BOARD_ID= ? ',
        'update_user_pw' : 'UPDATE GK_USERS SET USER_PW = ? WHERE USER_ID = ? ',
        'update_comment' : 'UPDATE COMMENT SET CONTENT = ? WHERE COMMENT_ID = ?',
        'update_user_login_dt' : 'UPDATE GK_USERS SET LOGIN_DATE= ? WHERE USER_ID= ? ',
        'update_user_withdtawal' : 'UPDATE GK_USERS SET STATUS = ? , WITHDRAWAL_REASON = ? WHERE USER_ID = ?',
        'update_user_info' : 'UPDATE GK_USERS SET USER_NAME = ?, USER_PHONE = ? , USER_EMAIL = ? WHERE USER_ID = ?',
        'update_board_hits' : 'UPDATE BOARD SET HITS= ? WHERE BOARD_ID = ?'
    }
}
