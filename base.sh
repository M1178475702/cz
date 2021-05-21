HOST="106.15.186.195"
UserDir=$(echo ~)
PemDir="$UserDir/.docker/rmpem"
Stage="" #build pack(+push) run

dr="docker --tlsverify --tlscacert=$PemDir/ca.pem --tlscert=$PemDir/cert.pem --tlskey=$PemDir/key.pem -H=$HOST:2376"

# consul in dev mode
dr run -d --name consul --network cz-net -p 8500:8500 -e CONSUL_BIND_INTERFACE=eth0 consul:1.9.5 

# EFK
