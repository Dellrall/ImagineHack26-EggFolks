package main

import (
	"log"
	"net/http"
	"os"
	"time"

	bridgehandlers "github.com/Dellrall/ImagineHack26-EggFolks/backend-ai/internal/handlers"
	bridgemiddleware "github.com/Dellrall/ImagineHack26-EggFolks/backend-ai/internal/middleware"
	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on system environment variables")
	}

	r := chi.NewRouter()
	bridgemiddleware.Apply(r)
	r.Use(chiMiddleware.Timeout(15 * time.Second))

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000"}, // Restrict to frontend in prod
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Define API V1 Routes
	r.Route("/api/v1", func(r chi.Router) {
		// Example endpoints mapping to the SKILLS.md contract
		r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte(`{"status": "AI Bridge is operational"}`))
		})

		bridgehandlers.RegisterRoutes(r)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("[AI-Bridge] Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
