module.exports = {
    'select' : {
        'list_comm_board' : 'SELECT * FROM BOARD_INQUIRY',
        'list_portpolio' : 'SELECT * FROM PORTPOLIO',
        'get_comm_board' : 'SELECT * FROM BOARD_INQUIRY WHERE BOARD_INQUIRY_ID = ?'
    },
    'insert' : {
        'add_comm_board' : 'INSERT INTO ?? SET ?'
    },
    'delete' : {
        'delete_comm_board' : 'DELETE FROM BOARD_INQUIRY WHERE BOARD_INQUIRY_ID = ?'
    }
}
