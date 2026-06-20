package handlers

import (
	"net/http"

	"eco-route/models"
	"eco-route/services"

	"github.com/gin-gonic/gin"
)

func SubmitFeedback(c *gin.Context) {
	var feedback models.Feedback
	if err := c.ShouldBindJSON(&feedback); err != nil {
		c.JSON(http.StatusBadRequest, services.ErrorEnvelope("invalid feedback request"))
		return
	}

	response, status := requestWorker.RouteFeedback(feedback)

	c.JSON(status, response)
}
