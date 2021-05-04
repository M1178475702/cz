package data

import (
	"context"
	"cz/app/service/main/collection/internal/conf"
	//v1 "cz/app/service/main/user/api/v1"
	db2 "cz/lib/db"
	http2 "cz/lib/net/http"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/google/wire"
	"gorm.io/gorm"
)

// ProviderSet is data providers.
var ProviderSet = wire.NewSet(NewData)

// Data .
type Data struct {
	// TODO warpped database client
	db      *gorm.DB
	client  *http2.CzHttpClient
	//userRPC v1.UserClient
	log     *log.Helper
}

// NewData .
func NewData(c *conf.Data, logger log.Logger) (*Data, func(), error) {
	cleanup := func() {
		//log.Print("message", "closing the data resources")
	}
	db, err := db2.NewDb(c.Mysql)
	if err != nil {
		return nil, nil, err
	}
	//conn, err := rpc.NewClient(c.UserClient.Name)
	return &Data{
		log:     log.NewHelper("collection.data", logger),
		//userRPC: v1.NewUserClient(conn),
		db:      db,
	}, cleanup, nil
}

func (d *Data) BeginTx(ctx context.Context) (tx *gorm.DB, clean func(), err error) {
	tx = d.db.WithContext(ctx).Begin()
	err = tx.Error
	if err != nil {
		return
	}
	clean = func() {
		if err != nil {
			tx.Rollback()
			return
		}
		tx.Commit()
	}
	return
}
