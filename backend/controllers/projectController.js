const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    let query;

    // If Admin, see all projects. If Member, see only projects where they are in teamMembers
    if (req.user.role === 'Admin') {
      query = Project.find().populate('createdBy', 'name email').populate('teamMembers', 'name email');
    } else {
      query = Project.find({ teamMembers: req.user.id }).populate('createdBy', 'name email').populate('teamMembers', 'name email');
    }

    const projects = await query;

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy', 'name email').populate('teamMembers', 'name email');

    if (!project) {
      return res.status(404).json({ message: `No project found with the id of ${req.params.id}` });
    }

    // Check if user is part of the project or an Admin
    if (req.user.role !== 'Admin' && !project.teamMembers.some(m => m._id.toString() === req.user.id)) {
        return res.status(403).json({ message: `Not authorized to access this project` });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: `No project found with the id of ${req.params.id}` });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: `No project found with the id of ${req.params.id}` });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
