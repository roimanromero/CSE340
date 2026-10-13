import express from 'express';
import { showOrganizationDetailsPage } from './controllers/organizations.js';
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showNewOrganizationForm } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';
import { testErrorPage, handle404, globalErrorHandler } from './controllers/errors.js';
import { processNewOrganizationForm } from './controllers/organizations.js';
import { organizationValidation} from './controllers/organizations.js';
const router = express.Router();

// Rutas principales de la aplicación
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Ruta para probar el flujo de errores intencionalmente
router.get('/test-error', testErrorPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for project details page
router.get('/project/:id', showProjectDetailsPage);

router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
// --- PIPELINE DE ERRORES ---
// 1. Captura cualquier ruta que no haya coincidido con las anteriores
router.use(handle404);

// 2. Manejador global que recibe los errores pasados mediante next(err)
router.use(globalErrorHandler);

export default router;