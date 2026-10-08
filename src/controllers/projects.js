const showProjectsPage = async (req, res, next) => {
    try {
        const title = 'Service Projects';
        const projects = await getAllProjects();
        
        if (NODE_ENV === 'development') {
            console.log(projects);
        }

        res.render('projects', { title, projects });
    } catch (error) {
        next(error);
    }
};

export { showProjectsPage };