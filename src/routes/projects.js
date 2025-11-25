const express = require('express');
const bcrypt = require('bcrypt');
const { ensureAuthenticated } = require('../middleware/auth');
const { Project } = require('../models');

const router = express.Router();

// ---- LOGIN ROUTES ----
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';

  // Compare (in real app, hash the password)
  const match = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;

  if (match) {
    req.session.isAuthenticated = true;
    return res.redirect('/admin');
  }

  res.render('login', { error: 'Invalid username or password' });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// ---- PROJECT ROUTES ----
router.get('/', async (req, res) => {
  const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
  res.render('index', { projects });
});

// Admin protected
router.get('/admin', ensureAuthenticated, async (req, res) => {
  const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
  res.render('admin', { error: null, values: {}, projects });
});

router.post('/admin/projects', ensureAuthenticated, async (req, res) => {
  const { title, description, tech, link } = req.body;
  if (!title) return res.render('admin', { error: 'Title is required', values: req.body });

  try {
    await Project.create({ title, description, tech, link });
    res.redirect('/');
  } catch (err) {
    res.render('admin', { error: 'Failed to create project', values: req.body });
  }
});

// API (public)
router.get('/api/projects', async (req, res) => {
  const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
  res.json(projects);
});

// Delete a project
router.post('/admin/projects/:id/delete', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    await Project.destroy({ where: { id } });
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.render('admin', { error: 'Failed to delete project', values: {} });
  }
});

module.exports = router;
