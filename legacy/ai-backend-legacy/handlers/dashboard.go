package handlers

import "github.com/gin-gonic/gin"

func GetStats(c *gin.Context) {
	c.JSON(200, gin.H{
		"carbon_saved": 523,
		"satisfaction": 4.5,
		"eco_points":   1200,
	})
}
