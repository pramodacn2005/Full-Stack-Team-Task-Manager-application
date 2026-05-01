const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

// Load env vars
dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    console.log('Old data cleared.');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'Admin',
    });

    // Create Member
    const member = await User.create({
      name: 'John Member',
      email: 'member@test.com',
      password: 'password123',
      role: 'Member',
    });

    console.log('Users created.');

    // Create Project
    const project = await Project.create({
      title: 'E-commerce Website Redesign',
      description: 'Complete overhaul of the main e-commerce storefront including new UI/UX, better payment gateways, and optimized mobile experience.',
      createdBy: admin._id,
      teamMembers: [admin._id, member._id],
    });

    console.log('Project created.');

    // Create Tasks
    await Task.create([
      {
        title: 'Design Homepage Mockups',
        description: 'Create high-fidelity mockups for the new homepage using Figma.',
        projectId: project._id,
        assignedTo: member._id,
        status: 'Done',
        priority: 'High',
        dueDate: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 days ago
      },
      {
        title: 'Implement Authentication',
        description: 'Set up JWT authentication for user login and signup flows.',
        projectId: project._id,
        assignedTo: admin._id,
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
      },
      {
        title: 'Setup Stripe Payment Gateway',
        description: 'Integrate the Stripe API for handling checkout securely.',
        projectId: project._id,
        assignedTo: member._id,
        status: 'To Do',
        priority: 'Medium',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      },
      {
        title: 'Mobile Responsiveness Testing',
        description: 'Ensure the new design works flawlessly on all mobile devices and tablets.',
        projectId: project._id,
        assignedTo: member._id,
        status: 'To Do',
        priority: 'Low',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
      }
    ]);

    console.log('Tasks created.');
    console.log('Database Seeding Completed Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
