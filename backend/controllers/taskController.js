const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks for a project or all tasks if Admin
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    let query;

    if (req.query.projectId) {
      // Check if user has access to project
      const project = await Project.findById(req.query.projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      if (req.user.role !== 'Admin' && !project.teamMembers.includes(req.user.id)) {
        return res.status(403).json({ message: 'Not authorized to view tasks for this project' });
      }
      query = Task.find({ projectId: req.query.projectId });
    } else {
        if (req.user.role === 'Admin') {
            query = Task.find();
        } else {
            // Member sees only their assigned tasks or tasks in projects they belong to
            // For simplicity, let's just return tasks assigned to them if no projectId is specified
            query = Task.find({ assignedTo: req.user.id });
        }
    }

    const tasks = await query.populate({
      path: 'projectId',
      select: 'title description'
    }).populate({
      path: 'assignedTo',
      select: 'name email'
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    req.body.projectId = req.body.projectId;

    const project = await Project.findById(req.body.projectId);

    if (!project) {
      return res.status(404).json({ message: `No project with the id of ${req.body.projectId}` });
    }

    // Only Admin can create tasks (or maybe team members too? Requirements say "Create task inside project", Admin has "Full task control", but "Admin: Create/delete projects, Assign users, Full task control"). Let's restrict task creation to Admin or anyone in the project depending on the role. For safety, let's allow Admin only, or team members to create tasks for their projects. Let's allow team members to create tasks for now.
    if (req.user.role !== 'Admin' && !project.teamMembers.includes(req.user.id)) {
         return res.status(403).json({ message: `Not authorized to add a task to this project` });
    }

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: `No task with the id of ${req.params.id}` });
    }

    // Admin can edit anything. Member can only update task status.
    if (req.user.role !== 'Admin') {
        // Members can only update status
        const allowedUpdates = ['status'];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Members can only update task status' });
        }
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: `No task with the id of ${req.params.id}` });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
