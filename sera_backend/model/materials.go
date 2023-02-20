package model

import (
	"example/task/database"

	"gorm.io/gorm"
)

type Material struct {
    gorm.Model
    MaterialId uint `gorm:"not_null;autoIncrement"`
    MaterialItems string `gorm:"size:255"`
    Buspartner string `gorm:"size:255"`
    Wallet_address string `gorm:"size:255"`
}

func (material *Material) Save() (*Material, error) {
    err := database.Database.Create(&material).Error

    if err != nil {
        return &Material{}, err
    }

    return material, nil
}

func FindMaterialById(id uint) (Material, error) {
    var material Material
    err := database.Database.Where("material_id=?", id).Find(&material).Error
    if err != nil {
        return Material{}, err
    }
    return material, nil
}