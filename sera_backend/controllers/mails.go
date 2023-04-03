package controllers

import (
	"log"

	// "fmt"
	"net/smtp"

	"github.com/gin-gonic/gin"
)

type EmailBody struct {
	From     string
	To       string
	Password string
}

func SendMail(c *gin.Context) {
	var input EmailBody

	c.Bind(&input)
	from := input.From
	pass := input.Password
	to := input.To

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: SERA Invitation\n\n" +
		"Hi, there." + "\n" + "You are invited to SERA autherized partner by " + from + "\n"

	err := smtp.SendMail("smtp.gmail.com:587",
		smtp.PlainAuth("", from, pass, "smtp.gmail.com"),
		from, []string{to}, []byte(msg))

	if err != nil {
		log.Printf("smtp error: %s", err)
		return
	}

	log.Print("sent")
}
