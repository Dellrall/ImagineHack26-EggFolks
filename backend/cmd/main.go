package main

import (
	"eco-route/routes"

	"github.com/gin-gonic/gin"
)

func main() {

	r := gin.Default()

	routes.SetupRoutes(r)

	r.Run(":3000")
}

