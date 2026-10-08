// Normalizamos NODE_ENV para evitar fallos por mayúsculas/minúsculas
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Controlador para probar un error 500 intencional
export const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err); 
};

// Middleware catch-all para capturar rutas inexistentes (404)
export const handle404 = (req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
};

// Middleware global para renderizar la vista de error adecuada (500 / 404)
export const globalErrorHandler = (err, req, res, next) => {
    console.error('Error occurred:', err.message);
    if (NODE_ENV === 'development') {
        console.error('Stack trace:', err.stack);
    }
    
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        status,
        error: err.message,
        NODE_ENV,
        stack: NODE_ENV === 'development' ? err.stack : null
    };
    
    res.status(status).render(`errors/${template}`, context);
};