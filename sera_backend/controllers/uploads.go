package controllers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	shell "github.com/ipfs/go-ipfs-api"
)

func UploadDocument(c *gin.Context) {
	// Multipart form
	form, _ := c.MultipartForm()
	files := form.File["document_account"]
	cids := []string{}

	sh := shell.NewShell("localhost:5001")

	for _, file := range files {
		log.Println(file.Filename)

		// Open the file on disk using the Open() method of *multipart.FileHeader
		openedFile, err := file.Open()
		if err != nil {
			log.Fatal(err)
		}
		defer openedFile.Close()

		// Add the file to IPFS
		cid, err := sh.Add(openedFile)
		if err != nil {
			log.Fatal(err)
		}

		cids = append(cids, cid)

		log.Println("File added to IPFS with CID:", cid)
	}

	fmt.Println(c.PostForm("key"))

	c.JSON(http.StatusCreated, gin.H{
		"status_code": 200,
		"api_version": "v1",
		"endpoint": "/uploaddocument",
		"status": "Success!",
		"msg":    "Uploaded a file.",
		"data": cids, 
	})
}