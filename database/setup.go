package database

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB is the global database instance
var DB *gorm.DB

func ConnectDB() {
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
