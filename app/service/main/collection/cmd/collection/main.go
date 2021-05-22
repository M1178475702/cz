package main

import (
	"cz/app/service/main/collection/internal/conf"
	config "cz/lib/conf"
	clog "cz/lib/log"
	"cz/lib/net/rpc"
	"flag"
	"github.com/go-kratos/kratos/v2"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/transport/grpc"
	"github.com/go-kratos/kratos/v2/transport/http"
)

// go build -ldflags "-X main.Version=x.y.z"
var (
	// flagconf is the conf flag.
	flagconf string
)

func init() {
	flag.StringVar(&flagconf, "conf", "", "conf path, eg: -conf conf.yaml")
}

func newApp(logger log.Logger, hs *http.Server, gs *grpc.Server, bc *conf.Bootstrap) *kratos.App {

	//服务注册
	if bc.Registry.Enable {
		reg := rpc.GetKConsulClient()
		return kratos.New(
			kratos.Name(bc.Name),
			kratos.Version(bc.Version),
			kratos.Metadata(map[string]string{}),
			kratos.Logger(logger),
			kratos.Registrar(reg),
			kratos.Server(
				hs,
				gs,
			),
		)
	} else {
		return kratos.New(
			kratos.Name(bc.Name),
			kratos.Version(bc.Version),
			kratos.Metadata(map[string]string{}),
			kratos.Logger(logger),
			kratos.Server(
				hs,
				gs,
			),
		)
	}
}

func main() {
	flag.Parse()
	//初始化配置
	bc := &conf.Bootstrap{}
	err := config.Init(flagconf, bc)
	if err != nil {
		panic(err)
	}
	//初始化logger
	logger, err := clog.NewLogger(bc.Logger)
	if err != nil {
		panic(err)
	}
	//初始化rpc，进行服务注册
	err = rpc.Init(bc.Registry)
	if err != nil {
		panic(err)
	}
	//初始化app
	app, cleanup, err := initApp(bc.Server, bc.Data, logger, bc)
	if err != nil {
		panic(err)
	}
	defer cleanup()

	// start and wait for stop signal
	if err = app.Run(); err != nil {
		panic(err)
	}
}
