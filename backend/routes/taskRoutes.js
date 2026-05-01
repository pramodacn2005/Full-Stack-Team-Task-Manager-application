const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(createTask); // Role check is inside controller

router
  .route('/:id')
  .put(updateTask) // Role check is inside controller
  .delete(authorize('Admin'), deleteTask);

module.exports = router;
