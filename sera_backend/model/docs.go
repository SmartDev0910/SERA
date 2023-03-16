package model

import (
	"example/task/database"

	"gorm.io/gorm"
)

type Document struct {
    gorm.Model
    Acid string `gorm:"size:255"`
    DocumentCid string `gorm:"size:255"`
    DocumentType string `gorm:"size:255"`
    DocumentName string `gorm:"size:255"`
    DocumentFileName string `gorm:"size:255"`
    From string `gorm:"size:255"`
    Status uint `gorm:"size:255"`
}

func (document *Document) Save() (*Document, error) {
    err := database.Database.Create(&document).Error

    if err != nil {
        return &Document{}, err
    }

    return document, nil
}

func FindDocumentByStatus(status uint) ([]Document, error) {
    var document []Document
    err := database.Database.Where("status=?", status).Find(&document).Error
    if err != nil {
        return document, err
    }
    return document, nil
}