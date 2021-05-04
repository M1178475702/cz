package conf

import (
	"cz/lib/conf"
	"cz/lib/db"
	"cz/lib/log"
	"cz/lib/net/rpc"
	"github.com/go-kratos/kratos/v2/config"
	"github.com/go-kratos/kratos/v2/config/file"
	"gopkg.in/yaml.v2"
)

var (
	bc Bootstrap
)

type Bootstrap struct {
	Name     string
	Version  string
	Data     *Data
	Logger   *log.Config
	Server   *Server
	Registry *rpc.Registry //注册
}

type Data struct {
	Mysql         *db.Config
	UserClient struct {
		Name string
	}
}

type Server struct {
	Http struct {
		Network string
		Addr    string
		Timeout int64
	}
	Grpc struct {
		Network string
		Addr    string
		Timeout int64
	}
}



func Init(confPath string) (cb *Bootstrap, err error) {
	var c config.Config
	if confPath == "" {
		confPath = ""
		err = conf.Remote(confPath)
		if err != nil {
			return
		}
	}
	c = config.New(
		config.WithSource(
			file.NewSource(confPath),
		),
		config.WithDecoder(func(kv *config.KeyValue, v map[string]interface{}) error {
			return yaml.Unmarshal(kv.Value, v)
		}),
	)
	if err = c.Load(); err != nil {
		return
	}
	if err = c.Scan(&bc); err != nil {
		return
	}
	cb = &bc
	return
}


