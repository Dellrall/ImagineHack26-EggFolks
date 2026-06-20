package handlers

import "github.com/gin-gonic/gin"

func SubmitFeedback(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Feedback Submitted",
	})
}
