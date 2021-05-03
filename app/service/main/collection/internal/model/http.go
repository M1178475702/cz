package model



type HttpGetUserByIdReq struct {
	UserId int `json:"user_id"`
}

type HttpGetUserByIdRes struct {
	NickName string `json:"nickname"`
	OpenId   string `json:"openId"`
}
