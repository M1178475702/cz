package model

type User struct {
	NickName string `json:"nickname"`
	UserId   int    `json:"userId"`
	OpenId   string `json:"openId"`
}

type CollectionListItem struct {
	CollId     int    `json:"coll_id"`
	ItemId     int    `json:"item_id"`
	CollType   int    `json:"coll_type"`
	CollName   string `json:"coll_name"`
	ModifyTime string `json:"modify_time"`
}

type Collection struct {
	CollId     int    `json:"coll_id"`
	UserId     int    `json:"user_id"`
	ItemId     int    `json:"item_id"`
	CollName   string `json:"coll_name"`
	CollType   int    `json:"coll_type"`
	Folder     int    `json:"folder"`
	Status     int    `json:"status"`
	CreateTime string `json:"create_time"`
	ModifyName string `json:"modify_time"`
}

