const express = require('express')

const {protect} = require('../middleware/authMiddleware')

const {
     createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz
} = require('../controller/quizController')

const router = express.Router()

router.use(protect)

router.route('/')
   .post(createQuiz)
   .get(getQuizzes)

   router.route("/:id")
       .get(getQuizById)
       .patch(updateQuiz)
       .delete(deleteQuiz)

       module.exports = router