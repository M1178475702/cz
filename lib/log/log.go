package log

import (
	"github.com/cockroachdb/errors"
	"github.com/go-kratos/fluent"
	"github.com/go-kratos/kratos/v2/log"
	"os"
)

type Config struct {
	FluentAddr   string
	File         string
	Stdout       bool
	EnableFluent bool
	EnableFile   bool
}

func NewLogger(config *Config) (logger log.Logger, err error) {
	if config.Stdout {
		logger = log.NewStdLogger(os.Stdout)
		return
	} else if config.EnableFluent {
		logger,err = NewFluentLogger(config.FluentAddr)
		if err != nil {
			return
		}
		return
	} else if config.EnableFile {
		var file *os.File
		file, err = os.Open(config.File)
		if err != nil {
			return nil, err
		}
		logger = log.NewStdLogger(file)
		return
	}
	return nil, errors.New("no supported logger")
}

func NewFluentLogger(fluentAddr string) (log.Logger, error) {
	logger, err := fluent.NewLogger(fluentAddr)
	return logger, err
}
