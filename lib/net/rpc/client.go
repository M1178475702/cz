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
	consulClient *consulApi.Client
)

type Registry struct {
	Enable bool
	Name   string
	Consul *consulApi.Config
}

func init() {
	registry = &Registry{
		Enable: false,
		Consul: &consulApi.Config{},
	}
}

func Init(config *Registry) error {
	var err error
	if config != nil {
		registry = config
		consulClient, err = consulApi.NewClient(registry.Consul)
		if err != nil {
			return err
		}
	}
	return nil
}

func GetKConsulClient() *consul.Registry {
	cli := consul.New(consulClient)
	return cli
}

func NewClient(name string) (conn *grpc.ClientConn, err error) {
	if registry.Enable {
		var dis *consul.Registry
		dis = GetKConsulClient()
		//指定provider（service name）
		endpoint := fmt.Sprintf("discovery://default/%s", name)
		conn ,err = kgrpc.Dial(context.Background(), kgrpc.WithEndpoint(endpoint),
			kgrpc.WithDiscovery(dis), kgrpc.WithOptions(grpc.WithInsecure()))
		if err != nil {
			return
		}
		return
	} else {
		conn, err = kgrpc.Dial(context.Background(), kgrpc.WithEndpoint("localhost:9000"),kgrpc.WithOptions(grpc.WithInsecure()))
		return
	}
}
