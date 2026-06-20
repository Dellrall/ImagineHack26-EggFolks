package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/Dellrall/ImagineHack26-EggFolks/backend-data/internal/db"
	"github.com/jackc/pgx/v5"
)

type AuthHandler struct {
	Queries *db.Queries
}

// Removed the password field entirely.
// Even if React still sends a password, Go will just ignore it.
type LoginRequest struct {
	Email string `json:"email"`
}

func (h *AuthHandler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// 1. Fetch the user strictly by their email
	user, err := h.Queries.GetUserByEmail(context.Background(), req.Email)
	if err != nil {
		// FAILSAFE: If you typo the email during the presentation,
		// it still lets you in with a fake profile so you don't crash.
		if err == pgx.ErrNoRows {
			log.Printf("DEMO MODE: Email '%s' not found. Generating fake profile.", req.Email)
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]interface{}{
				"message":    "Demo login successful (Failsafe)",
				"id":         999,
				"name":       "Demo Presenter",
				"email":      req.Email,
				"role":       "admin",
				"eco_points": 1500,
			})
			return
		}

		// Catch actual database connection issues
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	// 2. Email found! Log the bypass and send the real profile data immediately.
	log.Println("DEMO MODE: Email matched. Bypassing password check for:", user.Email)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":    "Login successful",
		"id":         user.ID,
		"name":       user.Name,
		"email":      user.Email,
		"role":       user.Role,
		"eco_points": user.EcoPoints,
	})
}
