package handlers

import (
	"eco-route/services"

	"github.com/gin-gonic/gin"
)

var aiClient = services.NewAIClient()

var requestWorker = services.NewRequestWorker(
	services.NewRouterService(aiClient),
	services.NewPointsService(aiClient),
)

func RecommendRoute(c *gin.Context) {
	response, status := requestWorker.RouteRecommendation()

	c.JSON(status, response)
}
