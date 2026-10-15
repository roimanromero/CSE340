import { getUpcomingProjects, getProjectDetails, createProject, updateProject} from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';
import { addVolunteer, removeVolunteer, isUserVolunteering } from '../models/volunteers.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Definición de las reglas de validación para los proyectos
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const showProjectsPage = async (req, res, next) => {
    try {
        const title = 'Upcoming Service Projects';
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

        res.render('projects', { title, projects });
    } catch (error) {
        next(error);
    }
};

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            const error = new Error('Project not found');
            error.status = 404;
            return next(error);
        }

        const categories = await getCategoriesByProjectId(projectId);
        
        let isVolunteering = false;
        if (req.session && req.session.user) {
            isVolunteering = await isUserVolunteering(projectId, req.session.user.user_id);
        }

        const title = project.title;

        res.render('project', { title, project, categories, isVolunteering });
    } catch (error) {
        next(error);
    }
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

const processNewProjectForm = async (req, res) => {
    // 1. Verificar si hay errores de validación
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        // Si falla, redirige de vuelta al formulario de creación
        return res.redirect('/new-project');
    }

    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        return res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        return res.redirect('/new-project');
    }
};

const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            const error = new Error('Project not found');
            error.status = 404;
            return next(error);
        }

        const organizations = await getAllOrganizations();
        const title = 'Edit Service Project';
        
        res.render('edit-project', { title, project, organizations });
    } catch (error) {
        next(error);
    }
};

const processEditProjectForm = async (req, res, next) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${req.params.id}`);
    }

    const projectId = req.params.id;
    const { title, description, location, date, organizationId } = req.body;

    try {
        await updateProject(projectId, title, description, location, date, organizationId);
        req.flash('success', 'Service project updated successfully!');
        return res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'There was an error updating the service project.');
        return res.redirect(`/edit-project/${projectId}`);
    }
};

import { getAllCategories, updateProjectCategories } from '../models/categories.js';

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            const error = new Error('Project not found');
            error.status = 404;
            return next(error);
        }

        const allCategories = await getAllCategories();
        const projectCategories = await getCategoriesByProjectId(projectId);
        const projectCategoryIds = projectCategories.map(cat => cat.category_id);

        const title = `Assign Categories: ${project.title}`;

        res.render('assign-categories', { title, project, allCategories, projectCategoryIds });
    } catch (error) {
        next(error);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    const projectId = req.params.id;
    let { categories } = req.body;

    if (!categories) {
        categories = [];
    } else if (!Array.isArray(categories)) {
        categories = [categories];
    }

    try {
        await updateProjectCategories(projectId, categories);
        req.flash('success', 'Project categories updated successfully!');
        return res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project categories:', error);
        req.flash('error', 'There was an error updating the categories.');
        return res.redirect(`/assign-categories/${projectId}`);
    }
};

const processAddVolunteer = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;

        await addVolunteer(projectId, userId);
        req.flash('success', 'You have successfully signed up to volunteer for this project!');
        return res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error adding volunteer:', error);
        req.flash('error', 'There was an error signing up as a volunteer.');
        return res.redirect(`/project/${req.params.id}`);
    }
};

const processRemoveVolunteer = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;

        await removeVolunteer(projectId, userId);
        req.flash('success', 'You have been removed as a volunteer for this project.');
        return res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'There was an error removing your volunteer signup.');
        return res.redirect(`/project/${req.params.id}`);
    }
};

const processDashboardRemoveVolunteer = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;

        await removeVolunteer(projectId, userId);
        req.flash('success', 'Project removed from your volunteer list.');
        return res.redirect('/dashboard');
    } catch (error) {
        console.error('Error removing volunteer from dashboard:', error);
        req.flash('error', 'There was an error removing the project.');
        return res.redirect('/dashboard');
    }
};

export { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm, 
    projectValidation,
    showEditProjectForm,
    processEditProjectForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    processAddVolunteer,
    processRemoveVolunteer,
    processDashboardRemoveVolunteer
};