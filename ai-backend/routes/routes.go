package routes

import (
	"eco-route/handlers"
	"eco-route/services"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api/v1")

	api.GET("/routes/recommend", handlers.RecommendRoute)

	api.POST("/routes/feedback", handlers.SubmitFeedback)

	api.GET("/points/me", handlers.GetPoints)

	api.GET("/health", func(c *gin.Context) {
		c.JSON(200, services.SuccessEnvelope(map[string]string{
			"status": "ok",
		}))
	})
}
