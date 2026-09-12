CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Create table: Projects
-- ========================================
CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    date DATE,
    CONSTRAINT fk_organization
        FOREIGN KEY(organization_id) 
        REFERENCES organizations(organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Projects
-- ========================================
-- Assuming organization_id 1, 2, and 3 exist from your organizations table
INSERT INTO projects (organization_id, title, description, location, date)
VALUES
(1, 'Community Center Roof Repair', 'Help us fix the roof of the local youth center.', '123 Main St', '2026-04-15'),
(1, 'Park Playground Build', 'Constructing new wooden playground equipment.', 'Central Park', '2026-04-22'),
(1, 'Sustainable Housing Workshop', 'Educating locals on eco-friendly home insulation.', 'Community Hall A', '2026-05-01'),
(1, 'Tool Library Organization', 'Sorting and cataloging donated construction tools.', 'Warehouse 4', '2026-05-10'),
(1, 'Accessibility Ramp Installation', 'Building a wheelchair ramp for a community member.', '789 Oak Ave', '2026-05-18'),

(2, 'Urban Garden Planting', 'Planting spring vegetables and herbs in the community plot.', 'GreenHarvest Lot B', '2026-04-12'),
(2, 'Composting 101 Seminar', 'Learn how to turn food scraps into rich garden soil.', 'Library Annex', '2026-04-20'),
(2, 'School Yard Harvest', 'Teaching kids how to harvest lettuce and tomatoes.', 'Lincoln Elementary', '2026-05-04'),
(2, 'Rain Barrel Workshop', 'Building rain collection barrels for local gardeners.', 'GreenHarvest Hub', '2026-05-12'),
(2, 'Farmers Market Booth Setup', 'Helping organize the seasonal neighborhood produce market.', 'Town Square', '2026-05-25'),

(3, 'Charity Run Registration', 'Assisting runners with check-in and packet pickup.', 'City Stadium', '2026-04-18'),
(3, 'Winter Coat Drive Sorting', 'Sorting and packing donated coats for local families.', 'UnityServe Center', '2026-04-28'),
(3, 'Senior Tech Support Day', 'Helping elderly residents learn how to use smartphones and computers.', 'Senior Living Center', '2026-05-08'),
(3, 'Soup Kitchen Food Prep', 'Chopping vegetables and preparing meals for the shelter.', 'Downtown Kitchen', '2026-05-15'),
(3, 'Neighborhood Cleanup Drive', 'Collecting litter and tidying up public spaces.', 'Eastside District', '2026-05-30');

SELECT * FROM projects;

SELECT 
    p.project_id, 
    p.title, 
    p.date, 
    o.name AS organization_name
FROM projects p
JOIN organizations o ON p.organization_id = o.organization_id;

-- ========================================
-- Create table: Categories
-- ========================================
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- ========================================
-- Create junction table: Project Categories (Many-to-Many)
-- ========================================
CREATE TABLE IF NOT EXISTS project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project
        FOREIGN KEY (project_id) 
        REFERENCES projects(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category
        FOREIGN KEY (category_id) 
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO categories (name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

-- ========================================
-- Associate Projects with Categories
-- ========================================
-- Linking sample projects to categories based on their IDs
INSERT INTO project_categories (project_id, category_id)
VALUES
(1, 3), (1, 1), -- Project 1 linked to Community Service and Environmental
(2, 1),         -- Project 2 linked to Environmental
(3, 2),         -- Project 3 linked to Educational
(4, 3),         -- Project 4 linked to Community Service
(5, 3),         -- Project 5 linked to Community Service
(6, 1),         -- Project 6 linked to Environmental
(7, 2),         -- Project 7 linked to Educational
(8, 2),         -- Project 8 linked to Educational
(9, 1),         -- Project 9 linked to Environmental
(10, 3),        -- Project 10 linked to Community Service
(11, 4),        -- Project 11 linked to Health and Wellness
(12, 3),        -- Project 12 linked to Community Service
(13, 2),        -- Project 13 linked to Educational
(14, 4),        -- Project 14 linked to Health and Wellness
(15, 1);        -- Project 15 linked to Environmental