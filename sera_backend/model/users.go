package model

import (
	"example/task/database"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	// "fmt"
)

type User struct {
    gorm.Model
    Email  string `gorm:"size:255;not null;unique"`
    Password string `gorm:"size:255"`
    Trade_name  string `gorm:"size:255"`
    Legal_name  string `gorm:"size:255"`
    Country  string `gorm:"size:255"`
    State_town  string `gorm:"size:255"`
    Building_number  string `gorm:"size:255"`
    Phone_number  string `gorm:"size:255"`
    Description  string `gorm:"size:255"`
    Wallet_address  string `gorm:"size:255"`
}

func (user *User) UpdateUser(u User) (User, error) {
    err := database.Database.Where("wallet_address=?", u.Wallet_address).Updates(u).Error
    if err != nil {
        return User{}, err
    }

    return u, nil
}

func (user *User) Save() (*User, error) {
    err := database.Database.Create(&user).Error

    if err != nil {
        return &User{}, err
    }

    return user, nil
}

func FindUserByUsername(email string) (User, error) {
    var user User
    err := database.Database.Where("email=?", email).Find(&user).Error
    if err != nil {
        return User{}, err
    }
    return user, nil
}


func FindUserByWalletAddress(wallet_address string) (User, error) {
    var user User
    err := database.Database.Where("wallet_address=?", wallet_address).Find(&user).Error
    if err != nil {
        return User{}, err
    }
    return user, nil
}

func IsValidPassword(password string) (User, error) {
    var user User
    err := database.Database.Where("password=?", password).Find(&user).Error
    if err != nil {
        return User{}, err
    }
    return user, nil
}

func IsValidWallet(wallet string) (User, error) {
    var user User
    err := database.Database.Where("wallet_address=?", wallet).Find(&user).Error
    if err != nil {
        return User{}, err
    }
    return user, nil
}

func (user *User) ValidatePassword(password string) error {
    return bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
}

