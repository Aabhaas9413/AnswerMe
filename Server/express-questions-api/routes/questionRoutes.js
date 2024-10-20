const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/', questionController.getQuestions);
router.post('/', questionController.addQuestion);
router.put('/:id', questionController.updateQuestion);
router.patch('/:id', questionController.patchQuestion);
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
