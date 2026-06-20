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
	Preference  string `json:"preference"`
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
	var origin, destination, preference string

	if r.Method == http.MethodPost {
		var req RouteRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err == nil {
			origin = req.Origin
			destination = req.Destination
			preference = req.Preference
		}
	}

	if origin == "" {
		origin = r.URL.Query().Get("origin")
	}
	if destination == "" {
		destination = r.URL.Query().Get("destination")
	}
	if preference == "" {
		preference = r.URL.Query().Get("preference")
	}

	if origin == "" {
		origin = "Subang Jaya"
	}
	if destination == "" {
		destination = "KL Sentral"
	}
	if preference == "" {
		preference = "eco"
	}

	apiKey := os.Getenv("GOOGLE_MAPS_API_KEY")
	routes, err := google.FetchMultiModeRoutes(r.Context(), origin, destination, apiKey)
	if err != nil {
		writeJSON(w, http.StatusOK, AIResponse{Data: fallbackRouteRecommendation(), Error: stringPtr(err.Error())})
		return
	}

	var recommended google.GoogleRoute
	if len(routes) > 0 {
		if preference == "speed" {
			bestIdx := 0
			bestSecs := 999999
			for idx, rt := range routes {
				secs := parseDurationSeconds(rt.TravelTime)
				if secs < bestSecs {
					bestSecs = secs
					bestIdx = idx
				}
			}
			recommended = routes[bestIdx]
		} else {
			bestIdx := 0
			bestSaved := -1.0
			for idx, rt := range routes {
				savedVal := parseCarbonSaved(rt.CarbonSaved)
				if savedVal > bestSaved {
					bestSaved = savedVal
					bestIdx = idx
				}
			}
			recommended = routes[bestIdx]
		}
	} else {
		recommended = google.GoogleRoute{
			Name:          "LRT Kelana Jaya Line → Walk",
			TransportType: "Public Transit",
			TravelTime:    "35 mins",
			DistanceKm:    "17.1 km",
			CarbonSaved:   "2.3 kg CO₂",
			Confidence:    "94%",
		}
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

func parseDurationSeconds(timeStr string) int {
	timeStr = strings.ToLower(timeStr)
	timeStr = strings.ReplaceAll(timeStr, ",", " ")
	parts := strings.Fields(timeStr)
	totalSecs := 0
	for i := 0; i < len(parts); i++ {
		val, err := strconv.Atoi(parts[i])
		if err != nil {
			continue
		}
		if i+1 < len(parts) {
			unit := parts[i+1]
			if strings.HasPrefix(unit, "min") {
				totalSecs += val * 60
			} else if strings.HasPrefix(unit, "hour") || strings.HasPrefix(unit, "hr") || strings.HasPrefix(unit, "jam") {
				totalSecs += val * 3600
			} else if strings.HasPrefix(unit, "sec") || strings.HasPrefix(unit, "saat") {
				totalSecs += val
			}
		} else {
			totalSecs += val * 60
		}
	}
	if totalSecs == 0 {
		return 1800
	}
	return totalSecs
}

func parseCarbonSaved(carbonStr string) float64 {
	parts := strings.Split(carbonStr, " ")
	if len(parts) > 0 {
		val, err := strconv.ParseFloat(parts[0], 64)
		if err == nil {
			return val
		}
	}
	return 0.0
}

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
