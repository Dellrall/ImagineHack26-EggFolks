package handlers

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/Dellrall/ImagineHack26-EggFolks/backend-ai/internal/google"
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

type RecommendedRouteWithAlternative struct {
	Name          string               `json:"name"`
	TransportType string               `json:"transportType"`
	TravelTime    string               `json:"travelTime"`
	CarbonSaved   string               `json:"carbonSaved"`
	Confidence    string               `json:"confidence"`
	Options       []google.GoogleRoute `json:"options"`
}

func HandleRouteRecommendation(w http.ResponseWriter, r *http.Request) {
	var origin, destination string

	if r.Method == http.MethodPost {
		var req RouteRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err == nil {
			origin = req.Origin
			destination = req.Destination
		}
	} else {
		// GET request
		origin = r.URL.Query().Get("origin")
		destination = r.URL.Query().Get("destination")
	}

	// Fallback default locations if not provided
	if origin == "" {
		origin = "Subang Jaya"
	}
	if destination == "" {
		destination = "Kuala Lumpur Sentral"
	}

	apiKey := os.Getenv("GOOGLE_MAPS_API_KEY")
	routes, err := google.FetchMultiModeRoutes(r.Context(), origin, destination, apiKey)
	if err != nil || len(routes) == 0 {
		routes = google.GetMockRoutes()
	}

	// Choose the Public Transit option as the recommended eco-route (typically index 2 in our implementation)
	var recommended google.GoogleRoute
	for _, rt := range routes {
		if rt.TransportType == "Public Transit" {
			recommended = rt
			break
		}
	}
	// Fallback to first option if no Public Transit is found
	if recommended.Name == "" && len(routes) > 0 {
		recommended = routes[0]
	}

	result := RecommendedRouteWithAlternative{
		Name:          recommended.Name,
		TransportType: recommended.TransportType,
		TravelTime:    recommended.TravelTime,
		CarbonSaved:   recommended.CarbonSaved,
		Confidence:    recommended.Confidence,
		Options:       routes,
	}

	writeJSON(w, http.StatusOK, AIResponse{Data: result, Error: nil})
}

// Helper function for consistent JSON envelopes
func writeJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}

func stringPtr(value string) *string {
	return &value
}

