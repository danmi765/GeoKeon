module.exports = {
    'select' : {
        'list_comm_board' : 'SELECT * FROM ??',
        'list_portpolio' : 'SELECT * FROM PORTPOLIO',
        'get_comm_board' : 'SELECT * FROM BOARD_INQUIRY WHERE BOARD_INQUIRY_ID = ?'
    },
    'insert' : {
        'add_comm_inquiry_board' : 'INSERT INTO BOARD_INQUIRY (BOARD_INQUIRY_TITLE, BOARD_INQUIRY_CONTENT, BOARD_INQUIRY_PW, BOARD_INQUIRY_WRITER, BOARD_INQUIRY_DATE) VALUES ?'
    },
    'delete' : {
        'delete_comm_board' : 'DELETE FROM BOARD_INQUIRY WHERE BOARD_INQUIRY_ID = ?'
    }
}
