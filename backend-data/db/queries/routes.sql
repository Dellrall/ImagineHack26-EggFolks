-- name: LogEcoRoute :one
INSERT INTO eco_route_logs (employee_id, transport_mode, distance_km, co2_saved_kg, gridlock_hours_bypassed)
VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at;

INSERT INTO employees (name, email, eco_points, password_hash, role)
VALUES 
    ('System Admin', 'admin@company.com', 0, '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiNb/NdGErCj3g.3V46n1x0L0Q0wK2', 'admin'),
    ('Alice Smith', 'alice.smith@company.com', 150, '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiNb/NdGErCj3g.3V46n1x0L0Q0wK2', 'employee'),
    ('Bob Jones', 'bob.jones@company.com', 45, '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiNb/NdGErCj3g.3V46n1x0L0Q0wK2', 'employee'),
    ('Charlie Davis', 'charlie.davis@company.com', 320, '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiNb/NdGErCj3g.3V46n1x0L0Q0wK2', 'employee');

-- name: GetCorporateCarbonMetrics :one
SELECT 
    COALESCE(SUM(co2_saved_kg), 0)::NUMERIC as total_co2_eliminated,
    COALESCE(SUM(gridlock_hours_bypassed), 0)::NUMERIC as total_hours_saved
FROM eco_route_logs;

-- name: GetLeaderboard :many
SELECT id, name, eco_points FROM employees 
ORDER BY eco_points DESC LIMIT 10;

-- name: UpdateEmployeePoints :exec
UPDATE employees SET eco_points = eco_points + $1 WHERE id = $2;

-- name: GetAvailablePerks :many
SELECT * FROM perks WHERE quantity_available > 0;

-- name: GetUserByEmail :one
SELECT id, name, email, password_hash, role, eco_points 
FROM employees 
WHERE email = $1 LIMIT 1;