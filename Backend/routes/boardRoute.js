const express = require('express');
const boardController = require('../controllers/boardController');

const router = express.Router();

router.get('/get_board/:id', boardController.getInforBoard);
router.put('/update_board/:id', boardController.updateBoard);
router.get('/get_boards_by_point/:point_id', boardController.getBoardsByPoint);

module.exports = router;

