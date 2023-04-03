package controllers

import (
	"example/task/database"

	// "fmt"
	"example/task/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UpdateUser(c *gin.Context) {
	var input model.User

	if err := c.Bind(&input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status_code": 500,
			"api_version": "v1",
			"endpoint":    "/updateuser",
			"status":      "Internal Server Error.",
			"msg":         "Internal Server Error.",
			"data":        nil,
		})
		c.Abort()
		return
	}

	user, err := input.UpdateUser(input)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status_code": 500,
			"api_version": "v1",
			"endpoint":    "/updateuser",
			"status":      "Failure!",
			"msg":         "Internal Server Error!",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status_code": 200,
		"api_version": "v1",
		"endpoint":    "/updateuser",
		"status":      "Updated Successfully!",
		"msg":         "Updated Successfully!",
		"data":        user,
	})
}

func SignUpUser(c *gin.Context) {
	var input model.User

	if err := c.Bind(&input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status_code": 500,
			"api_version": "v1",
			"endpoint":    "/SignUpUser",
			"status":      "Internal Server Error.",
			"msg":         "Internal Server Error.",
			"data":        nil,
		})
		c.Abort()
		return
	}

	user, err := model.FindUserByUsername(input.Email)
	if len(user.Email) != 0 {
		c.JSON(http.StatusConflict, gin.H{
			"status_code": 409,
			"api_version": "v1",
			"endpoint":    "/SignUpUser",
			"status":      "SignUp Failure!",
			"msg":         "Conflict Email",
		})
		return
	}

	wallet, err := model.IsValidWallet(input.Wallet_address)

	if len(wallet.Wallet_address) != 0 {
		c.JSON(http.StatusConflict, gin.H{
			"status_code": 409,
			"api_version": "v1",
			"endpoint":    "/SignUpUser",
			"status":      "SignUp Failure!",
			"msg":         "Conflict Wallet_address",
		})
		return
	}

	savedUser, err := input.Save()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status_code": 500,
			"api_version": "v1",
			"endpoint":    "/SignUpUser",
			"status":      "SignUp Failure!",
			"msg":         "Internal Server Error!",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status_code": 200,
		"api_version": "v1",
		"endpoint":    "/SignUpUser",
		"status":      "SignUp Success!",
		"msg":         "Welcome to SignUp",
		"data":        savedUser,
	})
}

func SignInUser(c *gin.Context) {
	var input model.User

	if err := c.Bind(&input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status_code": 500,
			"api_version": "v1",
			"endpoint":    "/SignInUser",
			"status":      "Internal Server Error.",
			"msg":         "Internal Server Error.",
			"data":        nil,
		})
		c.Abort()
		return
	}

	user, err := model.FindUserByWalletAddress(input.Wallet_address)

	if len(user.Wallet_address) == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status_code": 401,
			"api_version": "v1",
			"endpoint":    "/SignInUser",
			"status":      "Not exist!",
			"msg":         "You are not registered",
			"data":        err,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status_code": 200,
		"api_version": "v1",
		"endpoint":    "/SignInUser",
		"status":      "Login Success!",
		"msg":         "Welcome to Login",
		"data":        user,
	})
}

func GetUser(c *gin.Context) {
	var input model.User

	if err := c.Bind(&input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status_code": 500,
			"api_version": "v1",
			"endpoint":    "/GetUser",
			"status":      "Internal Server Error !",
			"msg":         "Internal Server Error !",
			"data":        nil,
		})
		c.Abort()
		return
	}

	user, err := model.FindUserByWalletAddress(input.Wallet_address)

	if len(user.Email) == 0 {
		c.JSON(http.StatusNoContent, gin.H{
			"status_code": 204,
			"api_version": "v1",
			"endpoint":    "/GetUser",
			"status":      "Not exist!",
			"msg":         "There is a no exist person!",
			"data":        err,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status_code": 200,
		"api_version": "v1",
		"endpoint":    "/GetUser",
		"status":      "Success!",
		"msg":         "Success.",
		"data":        user,
	})
}

func GetListUser(c *gin.Context) {
	var input []model.User

	if err := database.Database.Find(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status_code": 500,
			"api_version": "v1",
			"endpoint":    "/SignInUser",
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
			"endpoint":    "/GetListUser",
			"status":      "No Content!",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status_code": 200,
		"api_version": "v1",
		"endpoint":    "/GetListUser",
		"data":        input,
	})
}
