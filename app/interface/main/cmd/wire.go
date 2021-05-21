// +build wireinject

// The build tag makes sure the stub is not built in the final build.

package main

import (
	"cz/app/interface/main/internal/conf"
	"cz/app/interface/main/internal/server"
	"github.com/go-kratos/kratos/v2"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/google/wire"
)

// initApp init kratos application.
func initApp(log.Logger, *conf.Bootstrap) (*kratos.App, func(), error) {
	panic(wire.Build(server.ProviderSet, newApp))
}
