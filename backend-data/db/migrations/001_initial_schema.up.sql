-- Employees and Points
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100) DEFAULT 'IT' NOT NULL,
    home_location VARCHAR(255) DEFAULT 'Subang Jaya' NOT NULL,
    preferred_transport VARCHAR(100) DEFAULT 'LRT + Walk' NOT NULL,
    eco_points INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WFH Scheduling
CREATE TABLE wfh_requests (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commute and ESG Metrics
CREATE TABLE eco_route_logs (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    transport_mode VARCHAR(50) NOT NULL,
    distance_km NUMERIC(10, 2) NOT NULL,
    co2_saved_kg NUMERIC(10, 2) NOT NULL,
    gridlock_hours_bypassed NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Feedback Loop (RLHF)
CREATE TABLE feedback_loops (
    id SERIAL PRIMARY KEY,
    route_log_id INTEGER REFERENCES eco_route_logs(id),
    employee_id INTEGER REFERENCES employees(id),
    rating_score INTEGER NOT NULL,
    weather_condition VARCHAR(100),
    penalty_applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspace Occupancy
CREATE TABLE zone_occupancy (
    id SERIAL PRIMARY KEY,
    floor_number INTEGER NOT NULL,
    zone_id VARCHAR(50) NOT NULL,
    current_headcount INTEGER DEFAULT 0,
    max_capacity INTEGER NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Perks and Redemptions
CREATE TABLE perks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    point_cost INTEGER NOT NULL,
    quantity_available INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE claimed_perks (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    perk_id INTEGER REFERENCES perks(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Employees
INSERT INTO employees (name, email, department, home_location, preferred_transport, eco_points) VALUES
('John Tan', 'john.tan@egofolks.eco', 'IT', 'Subang Jaya', 'LRT + Walk', 1250),
('Sarah Lim', 'sarah.lim@egofolks.eco', 'Marketing', 'Petaling Jaya', 'LRT + Walk', 950),
('Ahmad Rosli', 'ahmad.rosli@egofolks.eco', 'Finance', 'Cheras', 'MRT + Walk', 820),
('Devi Naidu', 'devi.naidu@egofolks.eco', 'Operations', 'Klang', 'Carpool', 1100);

-- Seed Perks
INSERT INTO perks (name, point_cost, quantity_available) VALUES
('RM20 Grab Voucher', 1500, 10),
('Starbucks Coffee', 500, 25),
('RM50 Touch n Go Cash', 3000, 5);

-- Seed Route Logs for carbonStats, tardinessStats and history
-- Individual logs for John Tan
INSERT INTO eco_route_logs (employee_id, transport_mode, distance_km, co2_saved_kg, gridlock_hours_bypassed, created_at) VALUES
(1, 'LRT + Walk', 16.8, 2.3, 0.9, NOW() - INTERVAL '5 days'),
(1, 'Bus + Walk', 15.2, 2.0, 0.8, NOW() - INTERVAL '4 days'),
(1, 'Carpool', 18.0, 1.6, 0.5, NOW() - INTERVAL '3 days'),
(1, 'Bike + LRT', 16.5, 2.8, 1.1, NOW() - INTERVAL '2 days'),
(1, 'LRT + Walk', 16.8, 2.3, 0.9, NOW() - INTERVAL '1 day');

-- Aggregated logs for monthly and daily charts
INSERT INTO eco_route_logs (employee_id, transport_mode, distance_km, co2_saved_kg, gridlock_hours_bypassed, created_at) VALUES
(2, 'LRT', 15.0, 720.0, 82.0, '2026-01-15 12:00:00'),
(2, 'LRT', 15.0, 840.0, 96.0, '2026-02-15 12:00:00'),
(2, 'LRT', 15.0, 930.0, 74.0, '2026-03-15 12:00:00'),
(2, 'LRT', 15.0, 1050.0, 108.0, '2026-04-15 12:00:00'),
(2, 'LRT', 15.0, 1160.0, 92.0, '2026-05-15 12:00:00'),
(2, 'LRT', 15.0, 1250.0, 620.0, '2026-06-15 12:00:00');

-- Seed Feedback Loops
INSERT INTO feedback_loops (route_log_id, employee_id, rating_score, weather_condition) VALUES
(1, 1, 5, 'Rainy'),
(2, 1, 4, 'Sunny'),
(3, 1, 5, 'Sunny'),
(4, 2, 4, 'Cloudy'),
(5, 3, 5, 'Rainy'),
(6, 4, 3, 'Sunny');