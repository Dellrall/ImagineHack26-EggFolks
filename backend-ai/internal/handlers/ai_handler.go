package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os"
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
		http.Error(w, `{"data": null, "error": "Invalid payload"}`, http.StatusBadRequest)
		return
	}

	// Forward request to Python AI Microservice
	aiServiceURL := os.Getenv("AI_SERVICE_URL") + "/ai/route"
	jsonData, _ := json.Marshal(req)

	resp, err := http.Post(aiServiceURL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		// Fallback mechanism if AI is unreachable
		fallback := map[string]interface{}{
			"recommended_mode": "Rail Transit",
			"efficiency_ratio": 8.5,
			"warning":          "Adaptive AI offline. Defaulting to baseline rail.",
		}
		writeJSON(w, http.StatusOK, AIResponse{Data: fallback, Error: nil})
		return
	}
	defer resp.Body.Close()

	// Parse and pipe the response directly to the frontend
	var aiResult map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&aiResult)

	writeJSON(w, http.StatusOK, AIResponse{Data: aiResult, Error: nil})
}

// Helper function for consistent JSON envelopes
func writeJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}
