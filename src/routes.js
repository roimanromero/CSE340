import express from 'express';
import { showHomePage } from './controllers/index.js';
import { 
    showUserRegistrationForm, 
    processUserRegistrationForm, 
    showLoginForm, 
    processLoginForm, 
    processLogout, 
    requireLogin, 
    showDashboard, 
    requireRole,
    showUsersPage // <--- 1. Importar la nueva función
} from './controllers/users.js';
import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm, 
    processNewOrganizationForm, 
    showEditOrganizationForm, 
    processEditOrganizationForm, 
    organizationValidation 
} from './controllers/organizations.js';
import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm, 
    showEditProjectForm, 
    processEditProjectForm, 
    projectValidation,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from './controllers/projects.js';
import { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    showNewCategoryForm, 
    processNewCategoryForm, 
    showEditCategoryForm, 
    processEditCategoryForm, 
    categoryValidation 
} from './controllers/categories.js';
import { testErrorPage, handle404, globalErrorHandler } from './controllers/errors.js';

const router = express.Router();

// --- RUTAS PRINCIPALES ---
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// --- RUTAS DE ORGANIZACIONES (Protegidas con requireRole('admin')) ---
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);
router.get('/organization/:id', showOrganizationDetailsPage);

// --- RUTAS DE PROYECTOS (Protegidas con requireRole('admin')) ---
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);
router.get('/project/:id', showProjectDetailsPage);
router.get('/assign-categories/:id', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:id', requireRole('admin'), processAssignCategoriesForm);

// --- RUTAS DE CATEGORÍAS (Protegidas con requireRole('admin')) ---
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);
router.get('/category/:id', showCategoryDetailsPage);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

// --- RUTA DE USUARIOS (Solo Administradores) ---
router.get('/users', requireRole('admin'), showUsersPage); // <--- 2. Agregar ruta protegida

// --- RUTA DE PRUEBA DE ERRORES ---
router.get('/test-error', testErrorPage);

// --- PIPELINE DE ERRORES ---
router.use(handle404);
router.use(globalErrorHandler);

export default router;