package conf

import (
	"cz/lib/db"
	"cz/lib/log"
	"cz/lib/net/rpc"
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
	Mysql      *db.Config
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
