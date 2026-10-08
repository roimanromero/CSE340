const showCategoriesPage = async (req, res, next) => {
    try {
        const title = 'Categories';
        const categories = await getAllCategories();
        res.render('categories', { title, categories });
    } catch (error) {
        next(error);
    }
};

export { showCategoriesPage };