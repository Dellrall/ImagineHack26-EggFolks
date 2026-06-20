package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on system environment variables")
	}

	// 1. Initialize PostgreSQL Connection Pool using pgx
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		// Fallback local development DB URL
		dbURL = "postgres://postgres:change_me@localhost:5432/test_db?sslmode=disable"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		log.Printf("Warning: Unable to connect to database: %v. Database handlers will fallback to mock results.\n", err)
	} else {
		if err := pool.Ping(ctx); err != nil {
			log.Printf("Warning: Database ping failed: %v. Database handlers will fallback to mock results.\n", err)
		} else {
			log.Println("Successfully connected to PostgreSQL")
		}
	}
	if pool != nil {
		defer pool.Close()
	}

	// 2. Setup Router with CORS
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Define Internal API Routes
	r.Route("/internal/v1", func(r chi.Router) {
		r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`{"status": "Data Service is operational"}`))
		})

		r.Get("/stats/carbon", getCarbonStats(pool))
		r.Get("/stats/tardiness", getTardinessStats(pool))
		r.Get("/stats/satisfaction", getSatisfactionStats(pool))
		r.Get("/perks", getPerks(pool))
		r.Post("/perks/claim", claimPerk(pool))
		r.Get("/routes/history", getRouteHistory(pool))
		r.Get("/employees/profile", getEmployeeProfile(pool))
		r.Get("/points/me", getPointsMe(pool))
		r.Get("/allowance/me", getAllowanceMe(pool))
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("[Data-Service] Internal server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

// Handler functions with database connection fallbacks:

func getCarbonStats(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if pool == nil {
			// Mock Fallback
			json.NewEncoder(w).Encode(map[string]interface{}{
				"total": "1,250 kg CO₂",
				"monthly": []map[string]interface{}{
					{"label": "Jan", "value": 720},
					{"label": "Feb", "value": 840},
					{"label": "Mar", "value": 930},
					{"label": "Apr", "value": 1050},
					{"label": "May", "value": 1160},
					{"label": "Jun", "value": 1250},
				},
			})
			return
		}

		ctx := r.Context()
		var total float64
		err := pool.QueryRow(ctx, "SELECT COALESCE(SUM(co2_saved_kg), 0)::double precision FROM eco_route_logs").Scan(&total)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		rows, err := pool.Query(ctx, `
			SELECT 
				TO_CHAR(created_at, 'Mon') as label, 
				SUM(co2_saved_kg)::double precision as value
			FROM eco_route_logs
			GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
			ORDER BY DATE_TRUNC('month', created_at)
		`)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		type MonthVal struct {
			Label string  `json:"label"`
			Value float64 `json:"value"`
		}
		var monthly []MonthVal
		for rows.Next() {
			var mv MonthVal
			if err := rows.Scan(&mv.Label, &mv.Value); err == nil {
				monthly = append(monthly, mv)
			}
		}

		json.NewEncoder(w).Encode(map[string]interface{}{
			"total":   fmt.Sprintf("%.1f kg CO₂", total),
			"monthly": monthly,
		})
	}
}

func getTardinessStats(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if pool == nil {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"gridlockHoursAvoided": 620,
				"weekly": []map[string]interface{}{
					{"label": "Mon", "value": 82},
					{"label": "Tue", "value": 96},
					{"label": "Wed", "value": 74},
					{"label": "Thu", "value": 108},
					{"label": "Fri", "value": 92},
				},
			})
			return
		}

		ctx := r.Context()
		var gridlockHours float64
		err := pool.QueryRow(ctx, "SELECT COALESCE(SUM(gridlock_hours_bypassed), 0)::double precision FROM eco_route_logs").Scan(&gridlockHours)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		type DayVal struct {
			Label string  `json:"label"`
			Value float64 `json:"value"`
		}
		weekly := []DayVal{
			{"Mon", 82},
			{"Tue", 96},
			{"Wed", 74},
			{"Thu", 108},
			{"Fri", 92},
		}

		json.NewEncoder(w).Encode(map[string]interface{}{
			"gridlockHoursAvoided": gridlockHours,
			"weekly":               weekly,
		})
	}
}

func getSatisfactionStats(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if pool == nil {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"score": "4.6 / 5",
				"departments": []map[string]interface{}{
					{"name": "IT", "value": 34},
					{"name": "Marketing", "value": 22},
					{"name": "Finance", "value": 18},
					{"name": "Operations", "value": 16},
					{"name": "HR", "value": 10},
				},
			})
			return
		}

		ctx := r.Context()
		var avgScore float64
		err := pool.QueryRow(ctx, "SELECT COALESCE(AVG(rating_score), 0.0)::double precision FROM feedback_loops").Scan(&avgScore)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		rows, err := pool.Query(ctx, `
			SELECT COALESCE(e.department, 'IT') as name, COUNT(*)::int as value
			FROM feedback_loops f
			JOIN employees e ON f.employee_id = e.id
			GROUP BY e.department
		`)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		type DeptVal struct {
			Name  string `json:"name"`
			Value int    `json:"value"`
		}
		var depts []DeptVal
		for rows.Next() {
			var dv DeptVal
			if err := rows.Scan(&dv.Name, &dv.Value); err == nil {
				depts = append(depts, dv)
			}
		}

		json.NewEncoder(w).Encode(map[string]interface{}{
			"score":       fmt.Sprintf("%.1f / 5", avgScore),
			"departments": depts,
		})
	}
}

func getPerks(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if pool == nil {
			json.NewEncoder(w).Encode([]map[string]interface{}{
				{"id": 1, "name": "RM20 Grab Voucher", "pointCost": 1500, "quantityAvailable": 10},
				{"id": 2, "name": "Starbucks Coffee", "pointCost": 500, "quantityAvailable": 25},
				{"id": 3, "name": "RM50 Touch n Go Cash", "pointCost": 3000, "quantityAvailable": 5},
			})
			return
		}

		ctx := r.Context()
		rows, err := pool.Query(ctx, "SELECT id, name, point_cost, quantity_available FROM perks WHERE quantity_available > 0")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		type Perk struct {
			ID                int    `json:"id"`
			Name              string `json:"name"`
			PointCost         int    `json:"pointCost"`
			QuantityAvailable int    `json:"quantityAvailable"`
		}
		var perks []Perk
		for rows.Next() {
			var p Perk
			if err := rows.Scan(&p.ID, &p.Name, &p.PointCost, &p.QuantityAvailable); err == nil {
				perks = append(perks, p)
			}
		}
		json.NewEncoder(w).Encode(perks)
	}
}

func claimPerk(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		var req struct {
			PerkID     int `json:"perkId"`
			EmployeeID int `json:"employeeId"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid request body", http.StatusBadRequest)
			return
		}
		if req.EmployeeID == 0 {
			req.EmployeeID = 1
		}

		if pool == nil {
			json.NewEncoder(w).Encode(map[string]interface{}{"ok": true})
			return
		}

		ctx := r.Context()
		tx, err := pool.Begin(ctx)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer tx.Rollback(ctx)

		var cost, qty int
		err = tx.QueryRow(ctx, "SELECT point_cost, quantity_available FROM perks WHERE id = $1", req.PerkID).Scan(&cost, &qty)
		if err != nil {
			http.Error(w, "perk not found", http.StatusNotFound)
			return
		}

		if qty <= 0 {
			http.Error(w, "perk out of stock", http.StatusBadRequest)
			return
		}

		var points int
		err = tx.QueryRow(ctx, "SELECT eco_points FROM employees WHERE id = $1", req.EmployeeID).Scan(&points)
		if err != nil {
			http.Error(w, "employee not found", http.StatusNotFound)
			return
		}

		if points < cost {
			http.Error(w, "insufficient points balance", http.StatusBadRequest)
			return
		}

		_, err = tx.Exec(ctx, "UPDATE perks SET quantity_available = quantity_available - 1 WHERE id = $1", req.PerkID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		_, err = tx.Exec(ctx, "UPDATE employees SET eco_points = eco_points - $1 WHERE id = $2", cost, req.EmployeeID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		_, err = tx.Exec(ctx, "INSERT INTO claimed_perks (employee_id, perk_id) VALUES ($1, $2)", req.EmployeeID, req.PerkID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if err := tx.Commit(ctx); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(map[string]interface{}{"ok": true})
	}
}

func getRouteHistory(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if pool == nil {
			json.NewEncoder(w).Encode([]map[string]interface{}{
				{"id": 1, "date": "2026-06-17", "route": "Route A", "transportType": "LRT + Walk", "travelTime": "35 mins", "carbonSaved": "2.3 kg", "rating": 5},
				{"id": 2, "date": "2026-06-16", "route": "Route B", "transportType": "Bus + Walk", "travelTime": "42 mins", "carbonSaved": "2.0 kg", "rating": 4},
				{"id": 3, "date": "2026-06-14", "route": "Route C", "transportType": "Carpool", "travelTime": "28 mins", "carbonSaved": "1.6 kg", "rating": 5},
				{"id": 4, "date": "2026-06-13", "route": "Route D", "transportType": "Bike + LRT", "travelTime": "39 mins", "carbonSaved": "2.8 kg", "rating": 4},
				{"id": 5, "date": "2026-06-12", "route": "Route A", "transportType": "LRT + Walk", "travelTime": "36 mins", "carbonSaved": "2.2 kg", "rating": 5},
			})
			return
		}

		employeeID := 1
		ctx := r.Context()
		rows, err := pool.Query(ctx, `
			SELECT id, created_at, transport_mode, distance_km, co2_saved_kg, gridlock_hours_bypassed 
			FROM eco_route_logs 
			WHERE employee_id = $1 
			ORDER BY created_at DESC
		`, employeeID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		type HistoryItem struct {
			ID            int     `json:"id"`
			Date          string  `json:"date"`
			Route         string  `json:"route"`
			TransportType string  `json:"transportType"`
			TravelTime    string  `json:"travelTime"`
			CarbonSaved   string  `json:"carbonSaved"`
			Rating        int     `json:"rating"`
		}
		var history []HistoryItem
		for rows.Next() {
			var id int
			var createdAt time.Time
			var mode string
			var dist, co2, hours float64
			if err := rows.Scan(&id, &createdAt, &mode, &dist, &co2, &hours); err == nil {
				history = append(history, HistoryItem{
					ID:            id,
					Date:          createdAt.Format("2006-01-02"),
					Route:         fmt.Sprintf("Commute Option %d", id),
					TransportType: mode,
					TravelTime:    fmt.Sprintf("%d mins", int(dist*2)),
					CarbonSaved:   fmt.Sprintf("%.1f kg", co2),
					Rating:        5,
				})
			}
		}
		json.NewEncoder(w).Encode(history)
	}
}

func getEmployeeProfile(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if pool == nil {
			json.NewEncoder(w).Encode(map[string]string{
				"name":               "John Tan",
				"email":              "john.tan@egofolks.eco",
				"department":         "IT",
				"homeLocation":       "Subang Jaya",
				"preferredTransport": "LRT + Walk",
			})
			return
		}

		employeeID := 1
		ctx := r.Context()
		var name, email, dept, home, pref string
		err := pool.QueryRow(ctx, "SELECT name, email, department, home_location, preferred_transport FROM employees WHERE id = $1", employeeID).
			Scan(&name, &email, &dept, &home, &pref)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(map[string]string{
			"name":               name,
			"email":              email,
			"department":         dept,
			"homeLocation":       home,
			"preferredTransport": pref,
		})
	}
}

func getPointsMe(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if pool == nil {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"balance": 1250,
				"monthlyTarget": 1500,
				"monthlyProgress": 83,
				"carbonSavedKg": 45,
				"carbonGoalKg": 100,
				"nearestReward": map[string]interface{}{
					"title": "RM20 Grab Voucher",
					"pointsRequired": 1500,
					"image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
				},
				"pointsEarnedToday": 25,
				"pointsNeeded": 250,
			})
			return
		}

		employeeID := 1
		ctx := r.Context()
		var ecoPoints int
		err := pool.QueryRow(ctx, "SELECT eco_points FROM employees WHERE id = $1", employeeID).Scan(&ecoPoints)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var carbonSaved float64
		err = pool.QueryRow(ctx, "SELECT COALESCE(SUM(co2_saved_kg), 0)::double precision FROM eco_route_logs WHERE employee_id = $1", employeeID).Scan(&carbonSaved)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		nearestReward := map[string]interface{}{
			"title":          "RM20 Grab Voucher",
			"pointsRequired": 1500,
			"image":          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
		}

		progress := (ecoPoints * 100) / 1500
		if progress > 100 {
			progress = 100
		}

		json.NewEncoder(w).Encode(map[string]interface{}{
			"balance":            ecoPoints,
			"monthlyTarget":      1500,
			"monthlyProgress":    progress,
			"carbonSavedKg":      carbonSaved,
			"carbonGoalKg":       100,
			"nearestReward":      nearestReward,
			"pointsEarnedToday":  25,
			"pointsNeeded":       1500 - ecoPoints,
		})
	}
}

func getAllowanceMe(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"transport":     "RM120 remaining",
			"carbonCredits": 350,
		})
	}
}

