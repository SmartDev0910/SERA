package controllers

import (
	"example/task/database"
	"example/task/model"
	"fmt"
	"net/http"
	"os"
	"strings"

	"example/task/utils"

	"github.com/gin-gonic/gin"
	ipfsApi "github.com/ipfs/go-ipfs-api"
)

func ComposeDocument(c *gin.Context) {
	var input model.Document

	if err := c.Bind(&input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status_code": 500,
			"api_version": "v1",
			"endpoint":    "/composedoc",
			"status":      "Internal Server Error.",
			"msg":         "Internal Server Error.",
			"data":        nil,
		})
		c.Abort()
		return
	}

	savedDoc, err := input.Save()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status_code": 500,
			"api_version": "v1",
			"endpoint":    "/composedoc",
			"status":      "Composed a document Failure!",
			"msg":         "Internal Server Error!",
		})
		return
	}

	projectId := os.Getenv("INFURA_PROJECT_ID")
	projectSecret := os.Getenv("INFURA_API_KEY_SECRET")

	shell := ipfsApi.NewShellWithClient("https://ipfs.infura.io:5001", utils.NewClient(projectId, projectSecret))

	cid, err := shell.Add(strings.NewReader(savedDoc.Document))
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("File added to IPFS with CID:", cid)

	input.Cid = cid
	input.UpdateDocument(input)

	c.JSON(http.StatusCreated, gin.H{
		"status_code": 200,
		"api_version": "v1",
		"endpoint":    "/composedoc",
		"status":      "Success!",
		"msg":         "Composed a document successfully",
		"data":        cid,
	})
}

func GetListDocument(c *gin.Context) {
	var input []model.Document

	if err := database.Database.Find(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status_code": 500,
			"api_version": "v1",
			"endpoint":    "/GetListDocument",
			"status":      "Internal Server Error.",
			"msg":         "Internal Server Error.",
			"data":        err.Error(),
		})
		return
	}

	if len(input) == 0 {
		c.JSON(http.StatusNoContent, gin.H{
			"status_code": 204,
			"api_version": "v1",
			"endpoint":    "/GetListDocument",
			"status":      "No Content!",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status_code": 200,
		"api_version": "v1",
		"endpoint":    "/GetListDocument",
		"data":        input,
	})
}
