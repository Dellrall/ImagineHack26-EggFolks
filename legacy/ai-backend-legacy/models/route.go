package models

type RouteRecommendation struct {
	RecommendedRoute string  `json:"recommended_route"`
	TravelTime       int     `json:"travel_time"`
	CarbonSaved      float64 `json:"carbon_saved"`
	EcoPoints        int     `json:"eco_points"`
}
