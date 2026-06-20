package handlers

import "github.com/gin-gonic/gin"

func GetPoints(c *gin.Context) {
	response, status := requestWorker.MyPoints()

	c.JSON(status, response)
}
