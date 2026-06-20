package handlers

import "github.com/go-chi/chi/v5"

func RegisterRoutes(r chi.Router) {
	r.Get("/routes/recommend", HandleRouteRecommendation)
	r.Post("/routes/recommend", HandleRouteRecommendation)
}
