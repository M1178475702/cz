package server

import (
	"cz/app/interface/main/internal/server/http"
	"github.com/google/wire"
)

// ProviderSet is server providers.
var ProviderSet = wire.NewSet(http.NewGinHandler, http.NewHTTPServer)
