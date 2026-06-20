package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"strings"

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
	Name               string               `json:"name"`
	TransportType      string               `json:"transportType"`
	TravelTime         string               `json:"travelTime"`
	CarbonSaved        string               `json:"carbonSaved"`
	CarbonSavedTodayKg float64              `json:"carbonSavedTodayKg"`
	Confidence         string               `json:"confidence"`
	Options            []google.GoogleRoute `json:"options"`
}

func HandleRouteRecommendation(w http.ResponseWriter, r *http.Request) {
	var origin, destination string
	var preference string

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
		preference = r.URL.Query().Get("preference")
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

	// Filter based on preference (speed vs eco)
	var recommended google.GoogleRoute
	if len(routes) > 0 {
		if preference == "speed" {
			// Find route with the minimum travel time
			minMins := 99999
			for _, rt := range routes {
				mins := parseMinutes(rt.TravelTime)
				if mins < minMins {
					minMins = mins
					recommended = rt
				}
			}
		} else {
			// Find route with the maximum carbon saved (default eco)
			maxSaved := -1.0
			for _, rt := range routes {
				saved := parseCarbonSaved(rt.CarbonSaved)
				if saved > maxSaved {
					maxSaved = saved
					recommended = rt
				}
			}
		}
	}

	// Fallback to first option if nothing selected
	if recommended.Name == "" && len(routes) > 0 {
		recommended = routes[0]
	}

	result := RecommendedRouteWithAlternative{
		Name:               recommended.Name,
		TransportType:      recommended.TransportType,
		TravelTime:         recommended.TravelTime,
		CarbonSaved:        recommended.CarbonSaved,
		CarbonSavedTodayKg: parseCarbonSaved(recommended.CarbonSaved),
		Confidence:         recommended.Confidence,
		Options:            routes,
	}

	writeJSON(w, http.StatusOK, AIResponse{Data: result, Error: nil})
}

// Helper to parse minutes from "35 mins" or "39 min"
func parseMinutes(timeStr string) int {
	parts := strings.Split(timeStr, " ")
	if len(parts) > 0 {
		var digits []rune
		for _, r := range parts[0] {
			if r >= '0' && r <= '9' {
				digits = append(digits, r)
			}
		}
		if len(digits) > 0 {
			val, _ := strconv.Atoi(string(digits))
			return val
		}
	}
	return 9999
}

// Helper to parse carbon float from "2.2 kg CO₂"
func parseCarbonSaved(carbonStr string) float64 {
	parts := strings.Split(carbonStr, " ")
	if len(parts) > 0 {
		val, _ := strconv.ParseFloat(parts[0], 64)
		return val
	}
	return 0.0
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


