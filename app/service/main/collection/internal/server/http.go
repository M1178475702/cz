package server

import (
	v1 "cz/app/service/main/collection/api/v1"
	"cz/app/service/main/collection/internal/conf"
	"cz/app/service/main/collection/internal/service"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/middleware"
	"github.com/go-kratos/kratos/v2/middleware/logging"
	"github.com/go-kratos/kratos/v2/middleware/recovery"
	"github.com/go-kratos/kratos/v2/middleware/tracing"
	"github.com/go-kratos/kratos/v2/transport/http"
	"time"
)

// NewHTTPServer new a HTTP server.
func NewHTTPServer(c *conf.Server, collection *service.CollectionService, logger log.Logger) *http.Server {
	var opts = []http.ServerOption{}
	if c.Http.Network != "" {
		opts = append(opts, http.Network(c.Http.Network))
	}
	if c.Http.Addr != "" {
		opts = append(opts, http.Address(c.Http.Addr))
	}
	if c.Http.Timeout != 0 {
		opts = append(opts, http.Timeout(time.Duration(c.Http.Timeout)))
	}
	srv := http.NewServer(opts...)
	m := http.Middleware(
		middleware.Chain(
			recovery.Recovery(),
			tracing.Server(),
			logging.Server(logging.WithLogger(logger)),
		),
	)
	srv.HandlePrefix("/", v1.NewCollectionHandler(collection, m))
	return srv
}
