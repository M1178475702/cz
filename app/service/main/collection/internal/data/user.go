package data
//
//import (
//	"context"
//	"cz/app/service/main/collection/internal/model"
//	v1 "cz/app/service/main/user/api/v1"
//)
//
//func (d *Data) GetUserById(c context.Context, userId int) (user *model.User, err error) {
//	//d.client.DoCzHttp("GET", "/web/user")
//	req := &v1.GetUserByIdRequest{}
//	res, err := d.userRPC.GetUserById(c, req)
//	if err != nil {
//		return
//	}
//	user = &model.User{
//		NickName: res.Nickname,
//		UserId:   int(res.UserId),
//		OpenId:   res.OpenId,
//	}
//	return
//}
