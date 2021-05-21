package conf

import (
	"fmt"
	"github.com/go-kratos/kratos/v2/config"
	"github.com/go-kratos/kratos/v2/config/file"
	consulApi "github.com/hashicorp/consul/api"
	"gopkg.in/yaml.v3"
	"io/fs"
	"io/ioutil"
	"os"
)

type ConfigSource struct {
	Host       string
	Port       string
	ConfigPath string
	Version    string
}

var src ConfigSource

//func (c *ConfigSource) Load() ([]*config.KeyValue, error) {
//
//}
//
//func (c *ConfigSource) Watch() (config.Watcher, error) {
//
//}

func init() {
	src.Host = os.Getenv("CONF_HOST")
	src.Port = os.Getenv("CONF_PORT")
	src.ConfigPath = os.Getenv("CONF_PATH")
	src.Version = os.Getenv("CONF_VERSION")
}

//Remote download config file to destination
func Remote(dest string) error {
	configRaw, err := getValueFromConsul()
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(dest, configRaw, fs.ModeType)
	return err
}

func resolverRemoteConfig() *consulApi.Config {
	return &consulApi.Config{
		Address: fmt.Sprintf("%v%v", src.Host, src.Port),
	}

}

func getValueFromConsul() ([]byte, error) {
	client, err := consulApi.NewClient(resolverRemoteConfig())
	if err != nil {
		return nil, err
	}

	kv, _, err := client.KV().Get(fmt.Sprintf("%v/%v", src.ConfigPath, src.Version), nil)
	if err != nil {
		return nil, err
	}
	return kv.Value, nil
}

func Init(confPath string, bc interface{}) (err error) {
	var c config.Config
	if confPath == "" {
		confPath = "/etc/cz/config.yml"
		err = Remote(confPath)
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
	if err = c.Load(); err != nil {
		return
	}
	if err = c.Scan(bc); err != nil {
		return
	}
	return
}
