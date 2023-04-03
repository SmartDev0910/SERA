package main

import (
	"example/task/controllers"
	"example/task/database"
	"example/task/model"
	"fmt"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	loadEnv()
	loadDatabase()
	serveApplication()
}

func loadDatabase() {
	database.Connect()
	database.Database.AutoMigrate(&model.User{})
	database.Database.AutoMigrate(&model.Partner{})
	database.Database.AutoMigrate(&model.Material{})
	database.Database.AutoMigrate(&model.Document{})
}

func loadEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func serveApplication() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"POST", "PUT", "PATCH", "DELETE", "OPTION"},
		AllowHeaders: []string{"Content-Type, Authorization, X-Requested-With, access-control-allow-origin, access-control-allow-headers"},
	}))

	publicRoutes := router.Group("/api/v1")

	publicRoutes.GET("/getlist", controllers.GetListUser)
	publicRoutes.GET("/getlistrfq", controllers.GetListRFQ)
	publicRoutes.GET("/getlistdocument", controllers.GetListDocument)
	publicRoutes.POST("/signup", controllers.SignUpUser)
	publicRoutes.POST("/signin", controllers.SignInUser)
	publicRoutes.POST("/getuser", controllers.GetUser)
	publicRoutes.POST("/updateuser", controllers.UpdateUser)
	publicRoutes.POST("/addpartner", controllers.AddPartner)
	publicRoutes.POST("/getpartner", controllers.GetPartner)
	publicRoutes.POST("/getrfq", controllers.GetRFQ)
	publicRoutes.POST("/getrfqbystatus", controllers.GetRFQByStatus)
	publicRoutes.POST("/updaterfqbystatus", controllers.UpdateRFQByStatus)
	publicRoutes.POST("/addrfq", controllers.AddRFQ)
	publicRoutes.POST("/sendmail", controllers.SendMail)
	publicRoutes.POST("/uploaddocument", controllers.UploadDocument)
	publicRoutes.POST("/composedoc", controllers.ComposeDocument)

	fmt.Println("Server running on port 8000")

	router.Run(":8000")
}
