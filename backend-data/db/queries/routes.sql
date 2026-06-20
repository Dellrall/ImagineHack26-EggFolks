-- name: LogEcoRoute :one
INSERT INTO eco_route_logs (employee_id, transport_mode, distance_km, co2_saved_kg, gridlock_hours_bypassed)
VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at;

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