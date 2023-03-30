package controllers

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"example/task/utils"

	"github.com/gin-gonic/gin"
	ipfsApi "github.com/ipfs/go-ipfs-api"
)

func UploadDocument(c *gin.Context) {
	// Multipart form
	form, _ := c.MultipartForm()
	files := form.File["document_account"]
	cids := []string{}

	projectId := os.Getenv("INFURA_PROJECT_ID")
	projectSecret := os.Getenv("INFURA_API_KEY_SECRET")

	shell := ipfsApi.NewShellWithClient("https://ipfs.infura.io:5001", utils.NewClient(projectId, projectSecret))

	for _, file := range files {
		log.Println(file.Filename)

		// Open the file on disk using the Open() method of *multipart.FileHeader
		openedFile, err := file.Open()
		if err != nil {
			log.Fatal(err)
		}
		defer openedFile.Close()

		// Add the file to IPFS
		cid, err := shell.Add(openedFile)
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
		"endpoint":    "/uploaddocument",
		"status":      "Success!",
		"msg":         "Uploaded a file.",
		"data":        cids,
	})
}
