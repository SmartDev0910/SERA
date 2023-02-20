package controllers

import (
	"example/task/database"
	"example/task/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddRFQ(c *gin.Context) {
	var input model.Material

	if err := c.Bind(&input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status_code": 500,
			"api_version": "v1",
			"endpoint": "/AddRFQ",
			"status": "Internal Server Error.",
			"msg":    "Internal Server Error.",
			"data":   nil,
		})
		c.Abort()
		return
	}
	
	savedMaterial, err := input.Save()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status_code": 500,
			"api_version": "v1",
			"endpoint": "/AddRFQ",
			"status": "Add RFQ Failure!",
			"msg":    "Internal Server Error!",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status_code": 200,
		"api_version": "v1",
		"endpoint": "/AddRFQ",
		"status": "Success!",
		"msg":    "Added rfq successfully",
		"data": savedMaterial, 
	})
}

func GetListRFQ(c *gin.Context) {
	var input []model.Material

    if err := database.Database.Find(&input).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "status_code": 500,
            "api_version": "v1",
            "endpoint": "/GetListRFQ",
            "status": "Internal Server Error.",
            "msg":    "Internal Server Error.",
            "data":   err.Error(),
        })
        return
    }

    if len(input) == 0 {
        c.JSON(http.StatusNoContent, gin.H{
            "status_code": 204,
            "api_version": "v1",
            "endpoint": "/GetListRFQ",
            "status": "No Content!",
        })
        return
    }

    c.JSON(http.StatusOK,  gin.H{
        "status_code": 200,
        "api_version": "v1",
        "endpoint": "/GetListRFQ",
        "data": input,
    })
}

func GetRFQ(c *gin.Context) {
    var input model.Material

    if err := c.Bind(&input); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "status_code": 500,
            "api_version": "v1",
            "endpoint": "/GetRFQ",
            "status": "Internal Server Error !",
            "msg":    "Internal Server Error !",
            "data":   nil,
        })
        c.Abort()
        return
    } 

    material, err := model.FindMaterialById(input.MaterialId)

    if len(material.MaterialItems) == 0 {
        c.JSON(http.StatusNoContent, gin.H{
            "status_code": 204,
            "api_version": "v1",
            "endpoint": "/GetRFQ",
            "status": "Not exist!",
            "msg":    "There is a no exist person!",
            "data": err,
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "status_code": 200,
        "api_version": "v1",
        "endpoint": "/GetRFQ",
        "status": "Success!",
        "msg":    "Success.",
        "data": material,
    })
}