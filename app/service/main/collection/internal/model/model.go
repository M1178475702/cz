package model

type User struct {
	NickName string `json:"nickname"`
	UserId   int    `json:"userId"`
	OpenId   string `json:"openId"`
}

type CollectionListItem struct {
	CollId     int    `gorm:"column:coll_id"`
	ItemId     int    `gorm:"column:item_id"`
	CollType   int    `gorm:"column:coll_type"`
	CollName   string `gorm:"column:coll_name"`
	ModifyTime string `gorm:"column:modify_time;<-:false"`
}

type Collection struct {
	CollId     int    `gorm:"column:coll_id"`
	UserId     int    `gorm:"column:user_id"`
	ItemId     int    `gorm:"column:item_id"`
	CollName   string `gorm:"column:coll_name"`
	CollType   int    `gorm:"column:coll_type"`
	Folder     int    `gorm:"column:folder"`
	Status     int    `gorm:"column:status"`
	CreateTime string `gorm:"column:create_time;<-:false"`
	ModifyName string `gorm:"column:modify_time;<-:false"`
}

func (c *Collection) TableName() string {
	return "xd_xd_collection"
}

type CollectionCount struct {
	Id       int `gorm:"column:id"`
	Count    int `gorm:"column:count"`
	ItemId   int `gorm:"column:item_id"`
	CollType int `gorm:"column:coll_type"`
}

func (c *CollectionCount) TableName() string {
	return "xd_xd_collect_count"
}
