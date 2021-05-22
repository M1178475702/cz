./build.sh build i main cz-api 1.0 /cz/config/api
if [ $? != 0 ];then
	exit 1
fi
./build.sh build s collection cz-collection 1.0 /cz/config/collection
if [ $? != 0 ];then
	exit 1
fi
./build.sh build c cz cz-main 1.0
