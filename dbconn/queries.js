module.exports = {
    'select' : {
        'get_board_latest':"select a.*, b.*  from board as a, (select board_name from  board_domain where board_domain_id = ?) as b where board_domain_id = ? order by date desc limit 0,3;",
        /* 게시글이 하나도 없을 때 처리쿼리 필요 */
        // 'list_comm_board' : `SELECT BOARD.BOARD_ID, BOARD.TITLE, BOARD.CONTENT, BOARD.PASSWORD, BOARD.DATE, BOARD.HITS, BOARD.USER_ID, BOARD.BOARD_DOMAIN_ID FROM BOARD WHERE BOARD_DOMAIN_ID = ? ORDER BY DATE DESC`,
        'get_comm_board_length' : `
            SELECT COUNT(BOARD_ID) AS CNT FROM BOARD 
            WHERE BOARD.BOARD_DOMAIN_ID = ? AND BOARD.?? LIKE ?
        `,
        'list_comm_board' : `
            SELECT 
                CEILING( T.ROWNUM_B / 10 ) AS BOARD_PAGE,
                T.BOARD_ID, T.TITLE, T.CONTENT, T.DATE, T.HITS, T.USER_ID, T.BOARD_DOMAIN_ID, 
                T.ROWNUM_A AS ROWNUM
            FROM 
                (SELECT 
                    A.BOARD_ID, A.TITLE, A.CONTENT, A.DATE, A.HITS, A.USER_ID, A.BOARD_DOMAIN_ID, A.ROWNUM_A,
                    @RNUM_B := @RNUM_B + 1 AS ROWNUM_B
                FROM (
                        SELECT 
                            BOARD.BOARD_ID, BOARD.TITLE, BOARD.CONTENT, 
                            BOARD.DATE, BOARD.HITS, 
                            BOARD.USER_ID, BOARD.BOARD_DOMAIN_ID,
                            @RNUM_A := @RNUM_A + 1 AS ROWNUM_A
                        FROM (SELECT * FROM BOARD ORDER BY DATE ASC) BOARD, (SELECT @RNUM_A :=0 ) AS R
                        WHERE BOARD.BOARD_DOMAIN_ID = ?
                        ORDER BY ROWNUM_A DESC
                    ) A, (SELECT @RNUM_B :=0 ) AS R
                ) T
            WHERE CEILING( T.ROWNUM_B / 10 ) = ?
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
                        WHERE BOARD.BOARD_DOMAIN_ID = ? AND BOARD.?? LIKE ?
                ) A 
            ) T
            WHERE T.PAGE = ?
            ORDER BY T.ROWNUM DESC
        `,
        //'list_portpolio' : 'SELECT * FROM PORTPOLIO WHERE BUSINESS_ID = ? ORDER BY PORTPOLIO_ID DESC',
        'list_portpolio' : 'select * from portpolio order by business_id asc , portpolio_id desc',
        'list_business_domain' : 'SELECT * FROM BUSINESS_DOMAIN',
        'get_comm_board' : 'SELECT * FROM BOARD WHERE BOARD_ID = ?',
        'get_comm_board_for_user_id' : `
                                        SELECT T.*
                                        FROM (
                                                SELECT CEILING( A.ROWNUM / ? ) AS PAGE, A.*
                                                FROM (
                                                        SELECT BOARD.*, BOARD_DOMAIN.BOARD_NAME , @RNUM := @RNUM + 1 AS ROWNUM
                                                        FROM (SELECT * FROM BOARD ORDER BY DATE DESC) BOARD, BOARD_DOMAIN , (SELECT @RNUM :=0 ) AS R
                                                        WHERE BOARD.BOARD_DOMAIN_ID = BOARD_DOMAIN.BOARD_DOMAIN_ID AND USER_ID = ?
                                                    ) A 
                                            ) T
                                        WHERE T.PAGE = ?
        `,
        'get_board_all_cnt_for_user_id' : 'SELECT cOUNT(*) AS CNT FROM BOARD WHERE USER_ID = ?',
        'get_user_id' : 'SELECT * FROM GK_USERS WHERE USER_ID = ?',
        'get_user_id_for_email' : "SELECT CONCAT( SUBSTR( USER_ID, 1, LENGTH(USER_ID)-3 ), '***' ) AS USER_ID FROM GK_USERS WHERE USER_EMAIL = ?",
        'get_user_pw_for_user_id' : 'SELECT USER_PW FROM GK_USERS WHERE USER_ID = ?',
        'get_comment_list' : 'SELECT * FROM COMMENT WHERE BOARD_ID = ? ORDER BY DATE DESC',
        'get_comment_list_for_user_id' : `SELECT T.*
                                            FROM (
                                                    SELECT CEILING( A.ROWNUM / ? ) AS PAGE, A.*
                                                    FROM (
                                                            SELECT COMMENT.*, BOARD.TITLE, @RNUM := @RNUM + 1 AS ROWNUM
                                                            FROM (SELECT * FROM COMMENT ORDER BY DATE DESC) COMMENT, BOARD, (SELECT @RNUM :=0 ) AS R
                                                            WHERE COMMENT.BOARD_ID = BOARD.BOARD_ID AND COMMENT.USER_ID = ?
                                                        ) A 
                                                ) T
                                            WHERE T.PAGE = ?
                                            ORDER BY T.ROWNUM DESC`,
        'get_commet_all_cnt_for_user_id' : 'SELECT COUNT(*) AS CNT FROM COMMENT WHERE USER_ID = ? ',
        'get_board_domain_list' : 'SELECT * FROM BOARD_DOMAIN',
        'get_portpolio_for_portpolio_id' : 'SELECT * FROM PORTPOLIO WHERE PORTPOLIO_ID = ?',
        'get_intro' : `SELECT INTRO_ID, INTRO_CONTENT, ADDED_DT, USER_ID FROM INTRO ORDER BY ADDED_DT DESC LIMIT 1`,
    },
    'insert' : {
        'add_board_post' : 'INSERT INTO board (`TITLE`, `CONTENT`, `PASSWORD`, `DATE`, `HITS`, `USER_ID`, `BOARD_DOMAIN_ID`) VALUES (?, ?, ?, ?, ?, ?, ? )',
        'add_user' : 'INSERT INTO GK_USERS (`USER_ID`, `USER_PW`, `USER_NAME`, `USER_PHONE`, `USER_EMAIL`, `JOIN_DATE`, `STATUS`) VALUES (? , ? , ? , ? , ? , ? , ?)',
        'add_comment' : 'INSERT INTO COMMENT (`CONTENT`, `DATE`, `USER_ID`, `BOARD_ID`) VALUES (?, ?, ?, ?)',
        'add_portpolio' : 'INSERT INTO PORTPOLIO (`PORTPOLIO_IMG`, `PORTPOLIO_NAME`, `BUSINESS_ID`) VALUES (?, ?, ?)',
        'add_intro' : 'INSERT INTO INTRO (`INTRO_CONTENT`, `ADDED_DT`, `USER_ID`) VALUES (?, NOW(), ?)',
    },
    'delete' : {
        'delete_comm_board' : 'DELETE FROM BOARD WHERE BOARD_ID = ? AND PASSWORD = ?',
        'delete_comment' : 'DELETE FROM COMMENT WHERE COMMENT_ID = ?',
        'delete_design' : 'DELETE FROM PORTPOLIO WHERE PORTPOLIO_ID = ?'
    },
    'update' : {
        'update_board_content' : 'UPDATE BOARD SET TITLE=?,   CONTENT= ? WHERE BOARD_ID= ? ',
        'update_user_pw' : 'UPDATE GK_USERS SET USER_PW = ? WHERE USER_ID = ? ',
        'update_comment' : 'UPDATE COMMENT SET CONTENT = ? WHERE COMMENT_ID = ?',
        'update_user_login_dt' : 'UPDATE GK_USERS SET LOGIN_DATE= ? WHERE USER_ID= ? ',
        'update_user_withdtawal' : 'UPDATE GK_USERS SET STATUS = ? , WITHDRAWAL_REASON = ? WHERE USER_ID = ?',
        'update_user_info' : 'UPDATE GK_USERS SET USER_NAME = ?, USER_PHONE = ? , USER_EMAIL = ? WHERE USER_ID = ?',
        'update_board_hits' : 'UPDATE BOARD SET HITS= ? WHERE BOARD_ID = ?',
        'update_portpolio' : 'UPDATE PORTPOLIO SET PORTPOLIO_IMG= ?, PORTPOLIO_NAME=?, BUSINESS_ID=? WHERE PORTPOLIO_ID=? '
    }
}
