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
	consulConfig *consulApi.Config
)

func Init(config *consulApi.Config) {
	if consulConfig != nil {
		consulConfig = config
	}
}

func GetConsulClient() (*consul.Registry, error){
	ccli, err := consulApi.NewClient(consulConfig)
	if err != nil {
		return nil, err
	}
	cli := consul.New(ccli)
	return cli, nil
}



func NewClient(name string) (conn *grpc.ClientConn, err error) {
	dis, err := GetConsulClient()
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
}
