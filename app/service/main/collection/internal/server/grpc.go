package server

import (
	v1 "cz/app/service/main/collection/api/v1"
	"cz/app/service/main/collection/internal/conf"
	"cz/app/service/main/collection/internal/service"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/middleware"
	"github.com/go-kratos/kratos/v2/middleware/logging"
	"github.com/go-kratos/kratos/v2/middleware/recovery"
	"github.com/go-kratos/kratos/v2/middleware/status"
	"github.com/go-kratos/kratos/v2/middleware/tracing"
	"github.com/go-kratos/kratos/v2/transport/grpc"
	"time"
)

// NewGRPCServer new a gRPC server.
func NewGRPCServer(c *conf.Server, collection *service.CollectionService, logger log.Logger) *grpc.Server {
	var opts = []grpc.ServerOption{
		grpc.Middleware(
			middleware.Chain(
				recovery.Recovery(),
				status.Server(),
				tracing.Server(),
				logging.Server(logging.WithLogger(logger)),
			),
		),
	}
	if c.Grpc.Network != "" {
		opts = append(opts, grpc.Network(c.Grpc.Network))
	}
	if c.Grpc.Addr != "" {
		opts = append(opts, grpc.Address(c.Grpc.Addr))
	}
	if c.Grpc.Timeout != 0 {
		opts = append(opts, grpc.Timeout(time.Duration(1<<63 - 1)))
	}
	srv := grpc.NewServer(opts...)
	v1.RegisterCollectionServer(srv, collection)
	return srv
}
