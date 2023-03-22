package model

import (
	"example/task/database"

	"gorm.io/gorm"
)

type Document struct {
	gorm.Model
	Message  string `gorm:"size:255"`
	Document string `gorm:"size:2047"`
	Cid      string `gorm:"size:255"`
	From     string `gorm:"size:255"`
	Status   uint   `gorm:"size:255"`
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

func (document Document) UpdateDocument(doc Document) (Document, error) {
	err := database.Database.Where("id=?", doc.ID).Updates(doc).Error
	if err != nil {
		return Document{}, err
	}

	return doc, nil
}
