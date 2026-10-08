const showOrganizationsPage = async (req, res, next) => {
    try {
        const title = 'Our Partner Organizations';
        const organizations = await getAllOrganizations();
        res.render('organizations', { title, organizations });
    } catch (error) {
        next(error);
    }
};

export { showOrganizationsPage };