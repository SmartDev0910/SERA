package controllers

import (
	"example/task/database"
	"example/task/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddPartner(c *gin.Context) {
   var partner model.Partner

   if err := c.Bind(&partner); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "status_code": 500,
            "api_version": "v1",
            "endpoint": "/AddPartner",
            "status": "Server Error !",
            "msg":    "Server Error !",
        })
        c.Abort()
        return
    } 

    check := model.CheckPartner(partner.Wallet_address1, partner.Wallet_address2)

    if check > 0 {
        c.JSON(http.StatusBadRequest, gin.H{
            "status_code": 409,
            "api_version": "v1",
            "endpoint": "/AddPartner",
            "status": "Failure!",
            "msg":    "Conflict partner",
            "data": check, 
         })
    } else {
        database.Database.Create(&partner)
        c.JSON(http.StatusOK, gin.H{
            "status_code": 200,
            "api_version": "v1",
            "endpoint": "/AddPartner",
            "status": "Success!",
            "msg":    "Success",
         })
    }
}

func GetPartner(c *gin.Context) {
    var partner model.Partner
    var users []model.User

    if err := c.Bind(&partner); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "status_code": 500,
            "api_version": "v1",
            "endpoint": "/GetPartner",
            "status": "Server Error !",
            "msg":    "Server Error !",
        })
        c.Abort()
        return
    } 

    result := database.Database.Raw("SELECT U.* FROM partners PP LEFT JOIN users U ON U.wallet_address = PP.wallet_address2 WHERE PP.wallet_address1 = ?", partner.Wallet_address1).Find(&users)
    
    if result.Error != nil || len(partner.Wallet_address1) == 0 {
        c.JSON(http.StatusOK, gin.H{
            "status_code": 204,
            "api_version": "v1",
            "endpoint": "/GetPartner",
            "status": "No Content !",
            "msg":    "No Content !",
            "data": "[]",
        })
        return
    } 

    c.JSON(http.StatusOK, gin.H{
        "status_code": 200,
        "api_version": "v1",
        "endpoint": "/GetPartner",
        "status": "Success !",
        "msg":    "Success !",
        "data": users,
    })


}
