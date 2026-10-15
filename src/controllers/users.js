import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsersWithRoles } from '../models/users.js';
import { getVolunteeredProjectsByUser } from '../models/volunteers.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hashear la contraseña antes de guardarla para que sea compatible con bcrypt.compare en el login
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await createUser(name, email, hashedPassword);
        
        if (newUser) {
            req.flash('success', 'Registration successful! Please log in.');
            return res.redirect('/login');
        } else {
            req.flash('error', 'Could not register user. Please try again.');
            return res.redirect('/register');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        req.flash('error', 'An error occurred during registration. Email might already be in use.');
        return res.redirect('/register');
    }
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            // Store user info in session
            req.session.user = user;
            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            return res.redirect('/');
        } else {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        return res.redirect('/login');
    }
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

/**
 * Middleware factory to require specific role for route access
 * @param {string} role The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/dashboard'); // Redirige al dashboard si no es admin (según requerimiento W05)
        }

        // User has required role, continue
        next();
    };
};

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash('success', 'Logout successful!');
    return res.redirect('/login');
};

const showDashboard = async (req, res, next) => {
    try {
        const user = req.session.user;
        const volunteeredProjects = await getVolunteeredProjectsByUser(user.user_id);

        res.render('dashboard', { 
            title: 'Dashboard',
            name: user.name,
            email: user.email,
            volunteeredProjects
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        next(error);
    }
};

/**
 * Muestra la página con todos los usuarios registrados (Solo para Administradores)
 */
const showUsersPage = async (req, res, next) => {
    try {
        const users = await getAllUsersWithRoles();
        res.render('users', {
            title: 'Registered Users',
            users: users
        });
    } catch (error) {
        console.error('Error fetching users list:', error);
        next(error);
    }
};

export { 
    showUserRegistrationForm, 
    processUserRegistrationForm, 
    showLoginForm, 
    processLoginForm, 
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
};