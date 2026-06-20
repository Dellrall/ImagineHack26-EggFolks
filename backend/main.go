package main

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
	"gorm.io/gorm"

	// This connects to your new database folder
	"github.com/Dellrall/ImagineHack26-EggFolks/database"
)

func startSmartScheduler() {
	c := cron.New()
	c.AddFunc("@every 2m", func() {
		log.Println("[SCHEDULER] Running predictive environment analytics...")
		var pendingRequests []database.WFHRequest
		database.DB.Where("status = ?", "pending").Find(&pendingRequests)

		for _, req := range pendingRequests {
			req.Status = "approved_by_ai"
			database.DB.Save(&req)
			log.Printf("[SCHEDULER] Auto-approved WFH Request ID %d.\n", req.ID)
		}
	})
	c.Start()
	log.Println("Smart Scheduling Engine initialized.")
}

// --- MAIN ROUTER ---

func main() {
	_ = godotenv.Load()

	// Initialize the database from your new package
	database.ConnectDB()

	startSmartScheduler()

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := router.Group("/api")
	{
		// Commuter Flow
		api.POST("/routes/calculate", calculateRouteViaAI)
		api.POST("/routes/select", saveEcoRoute)
		api.POST("/routes/feedback", submitRLHFFeedback)

		// WFH Flow
		api.POST("/requests/wfh", createWFHRequest)

		// Dashboard Flow
		api.GET("/dashboard/metrics", getDashboardMetrics)
		api.GET("/dashboard/density", getZoneDensity)

		// Gamification & Perks
		api.GET("/employees/leaderboard", getLeaderboard)
		api.POST("/perks/redeem", redeemPerk)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}

// --- API HANDLERS ---

func createWFHRequest(c *gin.Context) {
	var req database.WFHRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	req.Status = "pending"
	if result := database.DB.Create(&req); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save to database"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Request saved", "data": req})
}

func saveEcoRoute(c *gin.Context) {
	var logEntry database.EcoRouteLog
	if err := c.ShouldBindJSON(&logEntry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := database.DB.Create(&logEntry); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save route log"})
		return
	}

	var emp database.Employee
	if err := database.DB.First(&emp, logEntry.EmployeeID).Error; err == nil {
		emp.EcoPoints += int(logEntry.CO2SavedKG * 10)
		database.DB.Save(&emp)
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Route logged and points awarded", "data": logEntry})
}

func submitRLHFFeedback(c *gin.Context) {
	var feedback database.FeedbackLoop
	if err := c.ShouldBindJSON(&feedback); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	feedback.PenaltyApplied = feedback.RatingScore < 3
	if result := database.DB.Create(&feedback); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save feedback"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Feedback submitted", "data": feedback})
}

func getDashboardMetrics(c *gin.Context) {
	var totalCO2 float64
	var totalGridlock float64
	database.DB.Model(&database.EcoRouteLog{}).Select("sum(co2_saved_kg)").Row().Scan(&totalCO2)
	database.DB.Model(&database.EcoRouteLog{}).Select("sum(gridlock_hours_bypassed)").Row().Scan(&totalGridlock)
	c.JSON(http.StatusOK, gin.H{
		"total_co2_eliminated_kg":   totalCO2,
		"cumulative_hours_bypassed": totalGridlock,
	})
}

func getZoneDensity(c *gin.Context) {
	var zones []database.ZoneOccupancy
	database.DB.Find(&zones)
	c.JSON(http.StatusOK, gin.H{"data": zones})
}

func getLeaderboard(c *gin.Context) {
	var employees []database.Employee
	database.DB.Order("eco_points desc").Limit(10).Find(&employees)
	c.JSON(http.StatusOK, gin.H{"leaderboard": employees})
}

func redeemPerk(c *gin.Context) {
	var req struct {
		EmployeeID uint `json:"employee_id" binding:"required"`
		PerkID     uint `json:"perk_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		var emp database.Employee
		if err := tx.First(&emp, req.EmployeeID).Error; err != nil {
			return err
		}

		var perk database.Perk
		if err := tx.First(&perk, req.PerkID).Error; err != nil {
			return err
		}

		if perk.QuantityAvailable <= 0 {
			c.JSON(http.StatusConflict, gin.H{"error": "Perk out of stock"})
			return nil
		}

		if emp.EcoPoints < perk.PointCost {
			c.JSON(http.StatusPaymentRequired, gin.H{"error": "Insufficient EcoPoints"})
			return nil
		}

		emp.EcoPoints -= perk.PointCost
		perk.QuantityAvailable -= 1

		if err := tx.Save(&emp).Error; err != nil {
			return err
		}
		if err := tx.Save(&perk).Error; err != nil {
			return err
		}

		claim := database.ClaimedPerk{EmployeeID: emp.ID, PerkID: perk.ID}
		if err := tx.Create(&claim).Error; err != nil {
			return err
		}

		c.JSON(http.StatusOK, gin.H{
			"message":          "Perk redeemed successfully",
			"remaining_points": emp.EcoPoints,
			"perk_claimed":     perk.Name,
		})
		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed: " + err.Error()})
	}
}

// --- PYTHON AI INTEGRATION (HTTP CLIENT) ---

func calculateRouteViaAI(c *gin.Context) {
	var payload map[string]interface{}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	jsonData, _ := json.Marshal(payload)
	pythonAIEndpoint := "http://localhost:5000/api/ai/optimize-route"

	resp, err := http.Post(pythonAIEndpoint, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"recommended_mode": "Rail",
			"efficiency_ratio": 8.5,
			"message":          "AI Unreachable. Defaulting to Rail Transit.",
		})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var aiResult map[string]interface{}
	json.Unmarshal(body, &aiResult)

	c.JSON(http.StatusOK, aiResult)
}
