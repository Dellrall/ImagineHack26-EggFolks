package main

import (
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// --- DATABASE MODELS ---

type Employee struct {
	ID        uint   `gorm:"primaryKey"`
	Name      string `json:"name"`
	Email     string `json:"email" gorm:"unique"`
	EcoPoints int    `json:"eco_points"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

type WFHRequest struct {
	ID         uint   `gorm:"primaryKey"`
	EmployeeID uint   `json:"employee_id" binding:"required"`
	Date       string `json:"date" binding:"required"`
	Reason     string `json:"reason" binding:"required"`
	Status     string `json:"status"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

type EcoRouteLog struct {
	ID                    uint    `gorm:"primaryKey"`
	EmployeeID            uint    `json:"employee_id" binding:"required"`
	TransportMode         string  `json:"transport_mode" binding:"required"`
	DistanceKM            float64 `json:"distance_km"`
	CO2SavedKG            float64 `json:"co2_saved_kg"`
	GridlockHoursBypassed float64 `json:"gridlock_hours_bypassed"`
	CreatedAt             time.Time
}

type FeedbackLoop struct {
	ID               uint   `gorm:"primaryKey"`
	RouteLogID       uint   `json:"route_log_id" binding:"required"`
	EmployeeID       uint   `json:"employee_id" binding:"required"`
	RatingScore      int    `json:"rating_score" binding:"required"`
	WeatherCondition string `json:"weather_condition"`
	PenaltyApplied   bool   `json:"penalty_applied"`
	CreatedAt        time.Time
}

type ZoneOccupancy struct {
	ID               uint   `gorm:"primaryKey"`
	FloorNumber      int    `json:"floor_number"`
	ZoneID           string `json:"zone_id"`
	CurrentHeadcount int    `json:"current_headcount"`
	MaxCapacity      int    `json:"max_capacity"`
	UpdatedAt        time.Time
}

type Perk struct {
	ID                uint   `gorm:"primaryKey"`
	Name              string `json:"name"`
	PointCost         int    `json:"point_cost"`
	QuantityAvailable int    `json:"quantity_available"`
	CreatedAt         time.Time
}

type ClaimedPerk struct {
	ID         uint `gorm:"primaryKey"`
	EmployeeID uint `json:"employee_id" binding:"required"`
	PerkID     uint `json:"perk_id" binding:"required"`
	CreatedAt  time.Time
}

// Global DB instance accessible by all files in 'package main'
var DB *gorm.DB

func initDB() {
	dsn := "host=" + os.Getenv("DB_HOST") +
		" user=" + os.Getenv("DB_USER") +
		" password=" + os.Getenv("DB_PASSWORD") +
		" dbname=" + os.Getenv("DB_NAME") +
		" port=" + os.Getenv("DB_PORT") +
		" sslmode=disable TimeZone=Asia/Kuala_Lumpur"

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	err = DB.AutoMigrate(
		&Employee{}, &WFHRequest{}, &EcoRouteLog{},
		&FeedbackLoop{}, &ZoneOccupancy{}, &Perk{}, &ClaimedPerk{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database schemas: ", err)
	}
	log.Println("Database schemas migrated successfully.")
}
