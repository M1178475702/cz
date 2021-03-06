// Code generated by Wire. DO NOT EDIT.

//go:generate go run github.com/google/wire/cmd/wire
//+build !wireinject

package main

import (
	"cz/app/service/main/collection/internal/biz"
	"cz/app/service/main/collection/internal/conf"
	"cz/app/service/main/collection/internal/data"
	"cz/app/service/main/collection/internal/server"
	"cz/app/service/main/collection/internal/service"
	"github.com/go-kratos/kratos/v2"
	"github.com/go-kratos/kratos/v2/log"
)

// Injectors from wire.go:

// initApp init kratos application.
func initApp(confServer *conf.Server, confData *conf.Data, logger log.Logger, bootstrap *conf.Bootstrap) (*kratos.App, func(), error) {
	dataData, cleanup, err := data.NewData(bootstrap, logger)
	if err != nil {
		return nil, nil, err
	}
	collectionBiz := biz.NewCollectionBiz(bootstrap, dataData, logger)
	collectionService := service.NewCollectionService(bootstrap, collectionBiz, logger)
	httpServer := server.NewHTTPServer(bootstrap, collectionService, logger)
	grpcServer := server.NewGRPCServer(confServer, collectionService, logger)
	app := newApp(logger, httpServer, grpcServer, bootstrap)
	return app, func() {
		cleanup()
	}, nil
}
