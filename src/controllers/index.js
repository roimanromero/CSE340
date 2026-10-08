const showHomePage = async (req, res, next) => {
    try {
        const title = 'Home';
        res.render('home', { title });
    } catch (error) {
        next(error);
    }
};

export { showHomePage };
