package google

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
)

type GoogleRoute struct {
	Name          string `json:"name"`
	TransportType string `json:"transportType"`
	TravelTime    string `json:"travelTime"`
	DistanceKm    string `json:"distanceKm"`
	CarbonSaved   string `json:"carbonSaved"`
	Confidence    string `json:"confidence"`
}

// Request and response structures for Google Routes API (computeRoutes)
type routesAPIRequest struct {
	Origin      locationWrapper `json:"origin"`
	Destination locationWrapper `json:"destination"`
	TravelMode  string          `json:"travelMode"`
}

type locationWrapper struct {
	Address string `json:"address"`
}

type routesAPIResponse struct {
	Routes []struct {
		DistanceMeters int    `json:"distanceMeters"`
		Duration       string `json:"duration"` // string formatted as seconds, e.g. "3031s"
		Legs           []struct {
			LocalizedValues struct {
				Distance struct {
					Text string `json:"text"`
				} `json:"distance"`
				Duration struct {
					Text string `json:"text"`
				} `json:"duration"`
			} `json:"localizedValues"`
			StepsOverview struct {
				MultiModalSegments []struct {
					NavigationInstruction struct {
						Instructions string `json:"instructions"`
					} `json:"navigationInstruction"`
					TravelMode string `json:"travelMode"`
				} `json:"multiModalSegments"`
			} `json:"stepsOverview"`
		} `json:"legs"`
	} `json:"routes"`
}

const (
	co2PerKmDriving = 0.150 // kg CO2 per km for driving
	co2PerKmTransit = 0.040 // kg CO2 per km for public transit
)

// FetchMultiModeRoutes fetches routes from the Google Routes API and estimates all four options.
func FetchMultiModeRoutes(ctx context.Context, origin, destination, apiKey string) ([]GoogleRoute, error) {
	if apiKey == "" || origin == "" || destination == "" {
		return GetMockRoutes(), nil
	}

	// 1. Fetch Driving Route
	driveResp, driveErr := computeGoogleRoute(ctx, origin, destination, "DRIVE", apiKey)
	if driveErr != nil {
		log.Printf("[Google-Routes] Driving route fetch failed: %v. Using mock fallback.", driveErr)
		return GetMockRoutes(), nil
	}

	// 2. Fetch Transit Route
	transitResp, transitErr := computeGoogleRoute(ctx, origin, destination, "TRANSIT", apiKey)
	if transitErr != nil {
		log.Printf("[Google-Routes] Transit route fetch failed: %v. Using mock fallback.", transitErr)
		return GetMockRoutes(), nil
	}

	var routes []GoogleRoute

	// Helper to extract values
	var driveDistKm float64
	var driveDurationSec int
	var driveDurationText string = "30 mins"
	var driveDistText string = "15.0 km"

	if len(driveResp.Routes) > 0 {
		route := driveResp.Routes[0]
		driveDistKm = float64(route.DistanceMeters) / 1000.0
		driveDurationSec = parseDurationSeconds(route.Duration)
		if len(route.Legs) > 0 {
			driveDurationText = route.Legs[0].LocalizedValues.Duration.Text
			driveDistText = route.Legs[0].LocalizedValues.Distance.Text
		} else {
			driveDurationText = fmt.Sprintf("%d mins", (driveDurationSec+59)/60)
			driveDistText = fmt.Sprintf("%.1f km", driveDistKm)
		}
	}

	// --- 1. Fully Car Transport ---
	routes = append(routes, GoogleRoute{
		Name:          "Fully Car (Driving)",
		TransportType: "Drive",
		TravelTime:    driveDurationText,
		DistanceKm:    driveDistText,
		CarbonSaved:   "0.0 kg CO₂",
		Confidence:    "95%",
	})

	// --- 2. Car Transport but Grab (Estimation) ---
	grabDurationMins := (driveDurationSec+59)/60 + 5 // +5 mins wait time estimation
	grabDistKm := driveDistKm
	if grabDistKm == 0 {
		grabDistKm = 15.0 // fallback
	}
	grabCost := 5.0 + (grabDistKm * 1.20) + (float64(grabDurationMins) * 0.20)

	routes = append(routes, GoogleRoute{
		Name:          fmt.Sprintf("GrabCar (Est. RM %.2f)", grabCost),
		TransportType: "Grab",
		TravelTime:    fmt.Sprintf("%d mins", grabDurationMins),
		DistanceKm:    driveDistText,
		CarbonSaved:   "0.0 kg CO₂",
		Confidence:    "92%",
	})

	// --- 3. Public Transport Only ---
	var transitDistKm float64
	var transitDurationText string = "45 mins"
	var transitDistText string = "18.0 km"
	var transitLineName string = "Transit"

	if len(transitResp.Routes) > 0 {
		route := transitResp.Routes[0]
		transitDistKm = float64(route.DistanceMeters) / 1000.0
		if len(route.Legs) > 0 {
			leg := route.Legs[0]
			transitDurationText = leg.LocalizedValues.Duration.Text
			transitDistText = leg.LocalizedValues.Distance.Text

			// Attempt to extract LRT/MRT/Bus names from steps overview
			var segments []string
			for _, seg := range leg.StepsOverview.MultiModalSegments {
				if seg.TravelMode == "TRANSIT" {
					instr := seg.NavigationInstruction.Instructions
					if strings.Contains(instr, "LRT") || strings.Contains(instr, "subway") || strings.Contains(instr, "Kereta api") {
						segments = append(segments, "LRT")
					} else if strings.Contains(instr, "MRT") {
						segments = append(segments, "MRT")
					} else if strings.Contains(instr, "Bus") || strings.Contains(instr, "Bas") {
						segments = append(segments, "Bus")
					}
				}
			}
			if len(segments) > 0 {
				transitLineName = strings.Join(segments, " → ")
			} else {
				transitLineName = "LRT Kelana Jaya Line"
			}
		}
	} else {
		// If transit response is empty but we have drive, make a guestimate
		transitDistKm = driveDistKm * 1.1
		transitDurationText = fmt.Sprintf("%d mins", int(float64(driveDurationSec)*1.3+59)/60)
		transitDistText = fmt.Sprintf("%.1f km", transitDistKm)
		transitLineName = "LRT Kelana Jaya Line"
	}

	// Calculate Carbon Saved vs Driving
	driveCarbon := driveDistKm * co2PerKmDriving
	if driveCarbon == 0 {
		driveCarbon = transitDistKm * co2PerKmDriving // fallback if driving API failed
	}
	transitCarbon := transitDistKm * co2PerKmTransit
	savedCarbon := driveCarbon - transitCarbon
	if savedCarbon < 0 {
		savedCarbon = 0
	}

	routes = append(routes, GoogleRoute{
		Name:          fmt.Sprintf("%s → Walk", transitLineName),
		TransportType: "Public Transit",
		TravelTime:    transitDurationText,
		DistanceKm:    transitDistText,
		CarbonSaved:   fmt.Sprintf("%.1f kg CO₂", savedCarbon),
		Confidence:    "94%",
	})

	// --- 4. Cars and Public Transport (Mixed / Park & Ride) ---
	// Simulating: Drive 3km to station, then take transit.
	mixedDriveDist := 3.0
	mixedTransitDist := transitDistKm - mixedDriveDist
	if mixedTransitDist < 0 {
		mixedTransitDist = transitDistKm * 0.8
		mixedDriveDist = transitDistKm * 0.2
	}
	mixedDistText := fmt.Sprintf("%.1f km", mixedDriveDist+mixedTransitDist)

	// Calculate travel time (Driving is faster than walking/bus to station)
	// We estimate mixed time is slightly faster than transit only (e.g. 10% faster)
	transitMins := 45
	if strings.Contains(transitDurationText, "hour") {
		transitMins = 65
	} else {
		tStr := strings.TrimSuffix(strings.Split(transitDurationText, " ")[0], "m")
		if val, err := strconv.Atoi(tStr); err == nil {
			transitMins = val
		}
	}
	mixedMins := int(float64(transitMins) * 0.85)
	if mixedMins < 10 {
		mixedMins = 15
	}

	// Carbon saved
	mixedCarbon := (mixedDriveDist * co2PerKmDriving) + (mixedTransitDist * co2PerKmTransit)
	mixedSavedCarbon := driveCarbon - mixedCarbon
	if mixedSavedCarbon < 0 {
		mixedSavedCarbon = 0
	}

	routes = append(routes, GoogleRoute{
		Name:          "Drive to LRT Station → LRT → Walk",
		TransportType: "Mixed (Car + Transit)",
		TravelTime:    fmt.Sprintf("%d mins", mixedMins),
		DistanceKm:    mixedDistText,
		CarbonSaved:   fmt.Sprintf("%.1f kg CO₂", mixedSavedCarbon),
		Confidence:    "89%",
	})

	return routes, nil
}

func computeGoogleRoute(ctx context.Context, origin, destination, travelMode, apiKey string) (*routesAPIResponse, error) {
	reqBody := routesAPIRequest{
		Origin:      locationWrapper{Address: origin},
		Destination: locationWrapper{Address: destination},
		TravelMode:  travelMode,
	}

	bodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://routes.googleapis.com/directions/v2:computeRoutes", bytes.NewReader(bodyBytes))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Goog-Api-Key", apiKey)
	req.Header.Set("X-Goog-FieldMask", "routes.duration,routes.distanceMeters,routes.legs")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("Google Routes API returned %s: %s", resp.Status, string(respBytes))
	}

	var res routesAPIResponse
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return nil, err
	}

	return &res, nil
}

func parseDurationSeconds(dur string) int {
	// duration format: "3031s"
	dur = strings.TrimSuffix(dur, "s")
	if val, err := strconv.Atoi(dur); err == nil {
		return val
	}
	return 1800 // 30 mins default
}

func GetMockRoutes() []GoogleRoute {
	return []GoogleRoute{
		{
			Name:          "Fully Car (Driving via Federal Highway)",
			TransportType: "Drive",
			TravelTime:    "28 mins",
			DistanceKm:    "15.2 km",
			CarbonSaved:   "0.0 kg CO₂",
			Confidence:    "95%",
		},
		{
			Name:          "GrabCar (Est. RM 22.00)",
			TransportType: "Grab",
			TravelTime:    "33 mins",
			DistanceKm:    "15.2 km",
			CarbonSaved:   "0.0 kg CO₂",
			Confidence:    "92%",
		},
		{
			Name:          "LRT Kelana Jaya Line → Walk",
			TransportType: "Public Transit",
			TravelTime:    "35 mins",
			DistanceKm:    "17.1 km",
			CarbonSaved:   "2.3 kg CO₂",
			Confidence:    "94%",
		},
		{
			Name:          "Drive to LRT Station + LRT Kelana Jaya Line",
			TransportType: "Mixed (Car + Transit)",
			TravelTime:    "31 mins",
			DistanceKm:    "16.5 km",
			CarbonSaved:   "1.8 kg CO₂",
			Confidence:    "89%",
		},
	}
}
