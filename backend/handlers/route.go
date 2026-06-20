package handlers

import "github.com/gin-gonic/gin"

func RecommendRoute(c *gin.Context) {
	c.JSON(200, gin.H{
		"route":        "MRT Kajang Line",
		"time":         35,
		"carbon_saved": 3.4,
	})
}
