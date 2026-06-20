package handlers

import (
	"encoding/json"
	"net/http"
	"os"

	bridgeai "github.com/Dellrall/ImagineHack26-EggFolks/backend-ai/internal/ai"
)

type RouteRequest struct {
	EmployeeID  string `json:"employee_id"`
	Origin      string `json:"origin"`
	Destination string `json:"destination"`
	Time        string `json:"time"`
}

type AIResponse struct {
	Data  interface{} `json:"data"`
	Error *string     `json:"error"`
}

func HandleRouteRecommendation(w http.ResponseWriter, r *http.Request) {
	var req RouteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, AIResponse{Data: nil, Error: stringPtr("invalid payload")})
		return
	}

	serviceURL := os.Getenv("AI_SERVICE_URL")
	if serviceURL == "" {
		writeJSON(w, http.StatusOK, AIResponse{Data: fallbackRouteRecommendation(), Error: nil})
		return
	}

	result, err := bridgeai.New(serviceURL).RecommendRoute(r.Context(), req)
	if err != nil {
		writeJSON(w, http.StatusOK, AIResponse{Data: fallbackRouteRecommendation(), Error: nil})
		return
	}

	writeJSON(w, http.StatusOK, AIResponse{Data: result, Error: nil})
}

// Helper function for consistent JSON envelopes
func writeJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}

func fallbackRouteRecommendation() map[string]interface{} {
	return map[string]interface{}{
		"recommended_mode": "Rail Transit",
		"efficiency_ratio": 8.5,
		"warning":          "Adaptive AI offline. Defaulting to baseline rail.",
	}
}

func stringPtr(value string) *string {
	return &value
}
