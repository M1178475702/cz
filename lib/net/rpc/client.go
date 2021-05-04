package rpc

import (
	"context"
	"fmt"
	consul "github.com/go-kratos/consul/registry"
	kgrpc "github.com/go-kratos/kratos/v2/transport/grpc"
	consulApi "github.com/hashicorp/consul/api"
	"google.golang.org/grpc"
)

var (
	registry *Registry
)

type Registry struct {
	Enable bool
	Name   string
	Consul *consulApi.Config
}

func Init(config *Registry) {
	if registry == nil {
		registry = config
	}
}

func GetConsulClient() (*consul.Registry, error){
	ccli, err := consulApi.NewClient(registry.Consul)
	if err != nil {
		return nil, err
	}
	cli := consul.New(ccli)
	return cli, nil
}



func NewClient(name string) (conn *grpc.ClientConn, err error) {
	if registry.Enable {
		var dis *consul.Registry
		dis, err = GetConsulClient()
		if err != nil {
			return
		}
		//指定provider（service name）
		endpoint := fmt.Sprintf("discovery://default/%s", name)
		conn ,err = kgrpc.Dial(context.Background(), kgrpc.WithEndpoint(endpoint), kgrpc.WithDiscovery(dis))
		if err != nil {
			return
		}
		return
	} else {
		conn, err = kgrpc.Dial(context.Background(), kgrpc.WithEndpoint("localhost:8001"))
		return
	}
}
