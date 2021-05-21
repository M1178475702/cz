package http

import (
	"cz/app/interface/main/internal/conf"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/transport/http"
	"time"
)

// NewHTTPServer new a HTTP server.
func NewHTTPServer(bc *conf.Bootstrap, handler *GinHandler, logger log.Logger) *http.Server {
	var opts = []http.ServerOption{}
	c := bc.Server
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
	//m := http.Middleware(
	//	middleware.Chain(
	//		recovery.Recovery(),
	//		tracing.Server(),
	//		logging.Server(logging.WithLogger(logger)),
	//	),
	//)

	srv.HandlePrefix("/", handler.Handler())
	return srv
}
