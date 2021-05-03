package conf

import (
	"cz/lib/conf"
	"cz/lib/db"
	"cz/lib/log"
	"github.com/go-kratos/kratos/v2/config"
	"github.com/go-kratos/kratos/v2/config/file"
	consulApi "github.com/hashicorp/consul/api"
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
	Registry Registry //注册
}

type Data struct {
	Mysql         *db.Config
	UserRPCClient struct {
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

type Registry struct {
	Name   string
	Consul *consulApi.Config
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
	if err := c.Load(); err != nil {
		return
	}
	if err := c.Scan(&bc); err != nil {
		return
	}
	cb = &bc
	return
}


