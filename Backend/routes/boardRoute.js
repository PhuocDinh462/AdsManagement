const express = require('express');
const boardController = require('../controllers/boardController');
const validationBoard = require('../middlewares/validation/board.middleware');

const router = express.Router();

router.get('/get_board/:id', boardController.getInforBoard);
router.patch('/update_board/:id', boardController.updateBoard);
router.get('/get_boards_by_point/:point_id', boardController.getBoardsByPoint);
router.get('/', boardController.getAllBoards);
router.delete('/:board_id', boardController.deleteBoardById);
router.post('/create', validationBoard, boardController.createBoard);

module.exports = router;
