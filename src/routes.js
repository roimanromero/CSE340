import express from 'express';
import { showHomePage } from './controllers/index.js';
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
    projectValidation 
} from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';
import { testErrorPage, handle404, globalErrorHandler } from './controllers/errors.js';

const router = express.Router();

// --- RUTAS PRINCIPALES ---
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// --- RUTAS DE ORGANIZACIONES ---
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);
router.get('/organization/:id', showOrganizationDetailsPage);

// --- RUTAS DE PROYECTOS ---
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);
router.get('/project/:id', showProjectDetailsPage);

// --- RUTAS DE CATEGORÍAS ---
router.get('/category/:id', showCategoryDetailsPage);

// --- RUTA DE PRUEBA DE ERRORES ---
router.get('/test-error', testErrorPage);

// --- PIPELINE DE ERRORES ---
// 1. Captura cualquier ruta que no haya coincidido con las anteriores
router.use(handle404);

// 2. Manejador global que recibe los errores pasados mediante next(err)
router.use(globalErrorHandler);

export default router;