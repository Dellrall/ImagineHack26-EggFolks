package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"

	"github.com/Dellrall/ImagineHack26-EggFolks/backend-data/internal/db"
	"github.com/Dellrall/ImagineHack26-EggFolks/backend-data/internal/handlers"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on system environment variables")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer pool.Close()

	if err := pool.Ping(ctx); err != nil {
		log.Fatalf("Database ping failed: %v\n", err)
	}
	log.Println("Successfully connected to PostgreSQL")

	// 2. Initialize sqlc queries and your AuthHandler
	queries := db.New(pool)
	authHandler := handlers.AuthHandler{
		Queries: queries,
	}

	// 3. Setup Router
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// 4. Expose the API routes for your React frontend
	r.Route("/api", func(r chi.Router) {
		// Your existing working login route
		r.Post("/login", authHandler.LoginHandler)

		// ==========================================
		// DEMO ROUTES: HARDCODED FOR PRESENTATION
		// ==========================================

		// Feeds the CarbonTreeCard, DashboardHero, and EcoPointsRewardCard
		r.Get("/employee/points", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`{
				"pointsEarnedToday": 150,
				"carbonSavedKg": 45.5,
				"carbonGoalKg": 100,
				"totalPoints": 1500
			}`))
		})

		// Feeds the DashboardHero "Carbon Today" stat
		r.Get("/employee/routes/recommended", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`{
				"carbonSavedTodayKg": 12.4
			}`))
		})

		// Feeds the TodayScheduleStatusCard
		r.Get("/employee/schedule", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`{
				"status": "On Track",
				"nextTrip": "17:30 to Home",
				"transportMode": "LRT"
			}`))
		})

		// Feeds the Table in routes.jsx
		r.Get("/employee/routes/history", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`[
				{"id": 1, "date": "2026-06-20", "route": "Home to Office", "transportType": "LRT", "travelTime": "45 min", "carbonSaved": "2.5 kg", "rating": 5},
				{"id": 2, "date": "2026-06-19", "route": "Office to Home", "transportType": "Bus", "travelTime": "55 min", "carbonSaved": "1.8 kg", "rating": 4},
				{"id": 3, "date": "2026-06-18", "route": "Client Site", "transportType": "Carpool", "travelTime": "30 min", "carbonSaved": "4.1 kg", "rating": 5}
			]`))
		})

		// Feeds the Grid in perks.jsx
		r.Get("/employee/perks", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`[
				{"id": 1, "title": "Free LRT Pass", "description": "Valid for 1 week", "pointCost": 500, "icon": "train"},
				{"id": 2, "title": "Coffee Voucher", "description": "Redeem at lobby cafe", "pointCost": 150, "icon": "coffee"},
				{"id": 3, "title": "Extra Leave Day", "description": "1 Day paid time off", "pointCost": 5000, "icon": "calendar"}
			]`))
		})

		// Catch-all for feedback submission in routes.jsx
		r.Post("/employee/routes/feedback", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`{"status": "success"}`))
		})
	})

	// (Keep your existing internal routes)
	r.Route("/internal/v1", func(r chi.Router) {
		r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte(`{"status": "Data Service is operational"}`))
		})
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
