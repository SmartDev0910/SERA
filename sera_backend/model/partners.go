package model

import (
    "example/task/database"
    "gorm.io/gorm"
    "fmt"
)


type Partner struct {
    gorm.Model
    Wallet_address1  string `gorm:"size:255"`
    Wallet_address2 string `gorm:"size:255"`
}

func CheckPartner(wallet1 string, wallet2 string) int {
    var cnt int
    database.Database.Raw("SELECT COUNT(*) FROM partners WHERE wallet_address1 = ? AND wallet_address2 = ?", wallet1, wallet2).Scan(&cnt)
    fmt.Println("count:", cnt)
    return cnt
}