package conf

import (
	"fmt"
	consulApi "github.com/hashicorp/consul/api"
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

func init(){
	src.Host = os.Getenv("CONF_HOST")
	src.Port = os.Getenv("CONF_PORT")
	src.ConfigPath = os.Getenv("CONF_PATH")
	src.Version = os.Getenv("CONF_VERSION")
}



//Remote download config file to destination
//
func Remote(dest string) error {
	configRaw, err := getValueFromConsul()
	if err != nil {
		return err
	}
	ioutil.WriteFile(dest, data)

	return nil
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


