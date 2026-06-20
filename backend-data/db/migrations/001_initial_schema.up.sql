-- Employees and Points
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
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