# build and upload to registry.aliyun

ImageTag=""
BuildDir=""
OutputPath=""
export GOOS=linux 
export GOARCH=amd64
HOST="106.15.186.195"
UserDir=$(echo ~)
PemDir="$UserDir/.docker/rmpem"
Stage="" #build pack(+push) run

dr="docker --tlsverify --tlscacert=$PemDir/ca.pem --tlscert=$PemDir/cert.pem --tlskey=$PemDir/key.pem -H=$HOST:2376"

Usage(){
	echo "Usage:"
	echo "./build$.sh {stage} {type} {parent dir} {ImageName（exe name, default main) {tag}}"
}

GoBuild(){
	go build -o $OutputPath $BuildDir
	if [ $? != 0 ];then
		exit 1
	fi
}

DockerBuild() {
	cd $ProjDir
	docker build --tag $ImageTag .
	if [ $? != 0 ];then
		exit 1
	fi
	docker login --username=zust_smxh -p Myu11510... registry.cn-hangzhou.aliyuncs.com
	if [ $? != 0 ];then
		exit 1
	fi
	docker push $ImageTag
	if [ $? != 0 ];then
		exit 1
	fi
}

DockerRun(){
	if [[ $Type = "i" ]];then
		DockerRunInterface
	elif [[ $Type = "s" ]];then
		DockerRunService
	elif [[ $Type = "c" ]];then
		DockerRunService
	fi
}

# 部署service不需要暴露端口
DockerRunService() {
	$dr rm -f $ImageName
	$dr rmi $ImageTag
	$dr run -itd  --name $ImageName \
		--network cz-net --network-alias $ImageName \
		-h $ImageName \
		--privileged \
		$ImageTag
}

DockerRunInterface() {
	$dr rm -f $ImageName
	$dr rmi $ImageTag
	$dr run -itd  --name $ImageName \
		--network cz-net --network-alias $ImageName \
		-h $ImageName \
		--privileged \
		-p 6001:6001 \
		$ImageTag
}

# $1 stage $2 type $3 name（parent dir,svc name） $4 ImageName（exe name） $5 tag
Stage=$1
Type=$2
Dir=$3
ImageName=$4 #容器名
Tag=$5
ImageTag=registry.cn-hangzhou.aliyuncs.com/bakatora/$ImageName:$5
ProjDir=""


if [[ $Type = "i" ]];then
	ProjDir=./app/interface/$Dir
	BuildDir=$ProjDir/cmd
elif [[ $Type = "s" ]];then
	ProjDir=./app/service/main/$Dir
	BuildDir=$ProjDir/cmd/$Dir
elif [[ $Type = "c" ]];then
	ProjDir=./app/service/main/$Dir
fi


OutputPath=$ProjDir/main

if [[ $Stage = "build" ]];then
	if [ $Type != "c" ];then
		GoBuild
	fi
	DockerBuild
	DockerRun
elif [[ $Stage = "pack" ]];then
	DockerBuild
	DockerRun
elif [[ $Stage = "run" ]];then
	DockerRun
elif [[ "1" = "1" ]]; then
	Usage
fi


# K8S
# 更新pod中image的tag
