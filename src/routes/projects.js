const express = require('express');
const router = express.Router();
const { Project } = require('../models');

// Landing: show simple list and link to admin
router.get('/', async (req, res) => {
  const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
  // If you want JSON API root, uncomment:
  // return res.json(projects);
  res.render('index', { projects });
});

// Admin page (form)
router.get('/admin', (req, res) => {
  res.render('admin', { error: null, values: {} });
});

// Create a new project (form submit)
router.post('/admin/projects', async (req, res) => {
  const { title, description, tech, link } = req.body;

  if (!title || title.trim().length === 0) {
    return res.render('admin', { error: 'Title is required', values: req.body });
  }

  try {
    await Project.create({ title, description, tech, link });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('admin', { error: 'Failed to create project', values: req.body });
  }
});

// JSON API for projects
router.get('/api/projects', async (req, res) => {
  const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
  res.json(projects);
});

module.exports = router;
