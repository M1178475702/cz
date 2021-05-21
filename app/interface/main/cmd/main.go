package main

import (
	"cz/app/interface/main/internal/conf"
	clog "cz/lib/log"
	"cz/lib/net/rpc"
	"flag"
	"github.com/go-kratos/kratos/v2"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/transport/http"
)

// go build -ldflags "-X main.Version=x.y.z"
var (
	// flagconf is the conf flag.
	flagconf string
)

func init() {
	flag.StringVar(&flagconf, "conf", "../../configs", "conf path, eg: -conf conf.yaml")
}

func newApp(logger log.Logger, hs *http.Server, bc *conf.Bootstrap) *kratos.App {

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
			),
		)
	}
}

func main() {
	flag.Parse()


	bc, err := conf.Init(flagconf)
	if err != nil {
		panic(err)
	}

	logger, err := clog.NewLogger(bc.Logger)
	if err != nil {
		panic(err)
	}
	rpc.Init(bc.Registry)
	app, cleanup, err := initApp(logger, bc)
	if err != nil {
		panic(err)
	}
	defer cleanup()

	// start and wait for stop signal
	if err := app.Run(); err != nil {
		panic(err)
	}
}