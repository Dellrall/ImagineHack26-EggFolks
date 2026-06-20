package handlers

import "github.com/gin-gonic/gin"

func RecommendRoute(c *gin.Context) {

	c.JSON(200, gin.H{
		"recommended_route": "MRT Kajang Line",
		"travel_time":       35,
		"carbon_saved":      3.4,
		"eco_points":        10,
	})
}
