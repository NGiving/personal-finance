const db = require('../models');
const utils = require('../services/utils');
const { checkAuthenticated } = require('../services/utils');
const userController = require('../controllers/userController');
const router = require('express').Router();

// Display User dashboard
router.get('/dashboard', userController.user_dashboard);

// Display list of all User expenses
router.get('/expenses', userController.user_expenses);

// Display User expense form on GET
router.get('/expenses/create', userController.user_expenses_create_get);

// Handle User expense create on POST
router.post('/expenses/create', userController.user_expenses_create_post);

// Display User expense edit on GET
router.get('/expenses/edit/:id', userController.user_expenses_edit_get)

// Handle User expense edit on PUT
router.put('/expenses/edit/:id', userController.user_expenses_edit_put)

// Handle User expense on DELETE
router.delete('/expenses', userController.user_expenses_delete)

// Display list of all User budgets
router.get('/budgets', userController.user_budgets);

// Display User budget form on GET
router.get('/budgets/create', userController.user_budgets_create_get);

// Handle User budget create on POST
router.post('/budgets/create', userController.user_budgets_create_post);

// Display list of all User invoices
router.get('/invoices', userController.user_invoices);

// Display list of all User reports
router.get('/reports', userController.user_reports);

// Display User settings form on GET
router.get('/settings', userController.user_settings);

// Handle User settings on PUT
router.put('/settings', userController.user_settings_update_put);

router.get('/logout', userController.logout)

module.exports = router