import { 
    getAllCategories, 
    getCategoryById, 
    getCategoriesByProjectId, 
    getProjectsByCategoryId,
    createCategory, 
    updateCategory 
} from '../models/categories.js';
import { body, validationResult } from 'express-validator';

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters')
];

const showCategoriesPage = async (req, res, next) => {
    try {
        const title = 'Project Categories';
        const categories = await getAllCategories();
        res.render('categories', { title, categories });
    } catch (error) {
        next(error);
    }
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            const error = new Error('Category not found');
            error.status = 404;
            return next(error);
        }

        // Obtener los proyectos asociados a esta categoría
        const projects = await getProjectsByCategoryId(categoryId);
        const title = category.name;

        res.render('category', { title, category, projects });
    } catch (error) {
        next(error);
    }
};

const showNewCategoryForm = (req, res) => {
    const title = 'Add New Category';
    res.render('new-category', { title });
};

const processNewCategoryForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-category');
    }

    const { name } = req.body;

    try {
        const categoryId = await createCategory(name);
        req.flash('success', 'Category created successfully!');
        return res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error creating category:', error);
        req.flash('error', 'There was an error creating the category.');
        return res.redirect('/new-category');
    }
};

const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        // Usamos getCategoryById aquí también
        const category = await getCategoryById(categoryId);

        if (!category) {
            const error = new Error('Category not found');
            error.status = 404;
            return next(error);
        }

        const title = 'Edit Category';
        res.render('edit-category', { title, category });
    } catch (error) {
        next(error);
    }
};

const processEditCategoryForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-category/${req.params.id}`);
    }

    const categoryId = req.params.id;
    const { name } = req.body;

    try {
        await updateCategory(categoryId, name);
        req.flash('success', 'Category updated successfully!');
        return res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'There was an error updating the category.');
        return res.redirect(`/edit-category/${categoryId}`);
    }
};

export { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    showNewCategoryForm, 
    processNewCategoryForm, 
    showEditCategoryForm, 
    processEditCategoryForm, 
    categoryValidation 
};