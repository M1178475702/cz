package conf

import "os"

type ConfigSource struct {
	Host string
	Port string
	ServiceName string
	Version string
}

var src ConfigSource

func init(){
	src.Host = os.Getenv("CONF_HOST")
	src.Port = os.Getenv("CONF_PORT")
	src.ServiceName = os.Getenv("CONF_NAME")
	src.Version = os.Getenv("CONF_VERSION")
}



//Remote download config file to destination
func Remote(dest string) error {
	return nil
}


