package db

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"time"
)

type Config struct {
	User     string
	Password string
	Host     string
	Port     string
	Database string
}

func init() {

}

func NewDb(conf *Config) (db *gorm.DB, err error) {
	dsn := "xd:xd#123456@tcp(47.98.146.46:33061)/xd_test?charset=utf8mb4&parseTime=True&loc=Local"
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return
	}
	sqlDB, err := db.DB()
	if err != nil {
		return
	}
	// SetMaxIdleConns 设置空闲连接池中连接的最大数量
	sqlDB.SetMaxIdleConns(10)

	// SetMaxOpenConns 设置打开数据库连接的最大数量。
	sqlDB.SetMaxOpenConns(100)

	// SetConnMaxLifetime 设置了连接可复用的最大时间。
	sqlDB.SetConnMaxLifetime(time.Hour)
	return
}
