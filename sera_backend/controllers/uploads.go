package controllers

import (
	// "fmt"

	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UploadDocument(c *gin.Context) {
		// Multipart form
		form, _ := c.MultipartForm()
		files := form.File["document_account"]

		for _, file := range files {
			log.Println(file.Filename)
			err := c.SaveUploadedFile(file, "upload/"+file.Filename)
			if err != nil {
				log.Fatal(err)
			}
		}

		fmt.Println(c.PostForm("key"))
		c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
}