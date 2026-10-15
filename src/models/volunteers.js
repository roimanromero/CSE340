import db from './db.js';

const addVolunteer = async (projectId, userId) => {
    const query = `
        INSERT INTO project_volunteers (project_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING project_id, user_id;
    `;
    const result = await db.query(query, [projectId, userId]);
    return result.rows[0];
};

const removeVolunteer = async (projectId, userId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE project_id = $1 AND user_id = $2;
    `;
    await db.query(query, [projectId, userId]);
};

const getVolunteeredProjectsByUser = async (userId) => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.location, 
            p.date, 
            o.name AS organization_name
        FROM public.projects p
        JOIN public.project_volunteers pv ON p.project_id = pv.project_id
        JOIN public.organizations o ON p.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY p.date ASC;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

const isUserVolunteering = async (projectId, userId) => {
    const query = `
        SELECT 1 
        FROM public.project_volunteers 
        WHERE project_id = $1 AND user_id = $2;
    `;
    const result = await db.query(query, [projectId, userId]);
    return result.rows.length > 0;
};

export {
    addVolunteer,
    removeVolunteer,
    getVolunteeredProjectsByUser,
    isUserVolunteering
};