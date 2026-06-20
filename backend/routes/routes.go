package routes

import (
	"eco-route/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {

	r.POST("/auth/login", handlers.Login)

	r.POST("/route/recommend", handlers.RecommendRoute)

	r.POST("/feedback", handlers.SubmitFeedback)

	r.GET("/points/:id", handlers.GetPoints)

	r.GET("/dashboard/stats", handlers.GetStats)
}
