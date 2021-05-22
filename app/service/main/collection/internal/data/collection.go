package data

import (
	"context"
	"cz/app/service/main/collection/internal/model"
	"github.com/cockroachdb/errors"
	"gorm.io/gorm"
)

const (
	sqlSelectCollectionList = "select coll_id, item_id, coll_name, modify_time, coll_type from xd_xd_collection where user_id = ? and folder = ? and status = ? and modify_time < ? limit 0, ?"
	sqlCreateCollection = "insert into xd_xd_collection (user_id, item_id, coll_name, coll_type, folder, status) values(?,?,?,?,?,?)"
	sqlIncreaseCollectionCount = "update xd_xd_collect_count set count = count - ? where id = ?"
	sqlDecreaseCollectionCount = "update xd_xd_collect_count set count = count - ? where id = ?"
	sqlUpdateCollectionStatus = "update xd_xd_collection set status = ? where coll_id = ?"
	sqlSelectCollectionListWithItemScope = "select coll_id, item_id, coll_type, coll_name, status from xd_xd_collection where user_id = ? and item_id in (?) and status = ? "
)

func (d *Data) GetCollectionList(ctx context.Context, userId, folder, status, ps int, lm string) (items []*model.CollectionListItem, err error){
	rows, err := d.db.WithContext(ctx).Raw(sqlSelectCollectionList, userId, folder, status, lm, ps).Rows()

	if err != nil {
		err = errors.Wrapf(err, "data.GetCollectionList select error")
		return
	}
	for rows.Next() {
		item := &model.CollectionListItem{}
		err = rows.Scan(&item.ItemId,  &item.CollId, &item.CollName,&item.ModifyTime, &item.CollType)
		if err != nil {
			err = errors.Wrapf(err, "data.GetCollectionList scan error")
			return
		}
		items = append(items, item)
	}
	return
}

func (d *Data) GetCollectionByUIC(ctx context.Context, userId, itemId, collType, status int) (collection *model.Collection, err error) {
	collection = &model.Collection{}
	err = d.db.WithContext(ctx).Table("xd_xd_collection").
		Where("user_id = ?", userId).
		Where("item_id = ?", itemId).
		Where("status = ?", status).
		Where("coll_type = ?", collType).First(&collection).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound{
			collection = nil
			err = nil
			return
		}
		collection = nil
		err = errors.Wrapf(err, "data.GetCollectionByUIC error")
		return
	}
	return
}

func (d *Data) GetCollectionById(ctx context.Context, collId int) (collection *model.Collection, err error) {
	collection = &model.Collection{}
	err = d.db.WithContext(ctx).Table("xd_xd_collection").
		Where("coll_id = ?", collId).First(&collection).Error
	if err != nil {
		collection = nil
		err = errors.Wrapf(err, "data.GetCollectionByUIC error")
		return
	}
	return
}

func (d *Data) TxCreateCollection(tx *gorm.DB, userId, itemId, collType, folder int, collName string) (collection *model.Collection, err error){
	collection = new(model.Collection)
	err = tx.Exec(sqlCreateCollection, userId, itemId, collName, collType, folder, 1).Scan(&collection).Error
	if err != nil {
		err = errors.Wrapf(err, "data.TxCreateCollection error")
		return
	}
	return
}

func (d *Data) GetCollectionCount(ctx context.Context, itemId, collType int) (ccnt *model.CollectionCount, err error) {
	ccnt = new(model.CollectionCount)
	err = d.db.WithContext(ctx).Table("xd_xd_collect_count").
		Where("item_id = ?", itemId).Where("coll_type = ?", collType).
		First(ccnt).Error
	if err != nil {
		err = errors.Wrapf(err, "data.GetCollectionCount error")
		return
	}
	return
}

func (d *Data) TxCreateCollectionCount(tx *gorm.DB, itemId, collType int) (collId int, err error){
	ccnt := new(model.CollectionCount)
	ccnt.Count = 0
	ccnt.ItemId = itemId
	ccnt.CollType = collType
	err = tx.Create(&ccnt).Error
	if err != nil {
		err = errors.Wrapf(err, "data.TxCreateCollectionCount error")
	}
	return
}

func (d *Data) TxIncreaseCollectionCount(tx *gorm.DB, collId, count int) (err error) {
	if count >= 0 {
		err = tx.Exec(sqlIncreaseCollectionCount, count, collId).Error

	} else {
		err = tx.Exec(sqlDecreaseCollectionCount, count, collId).Error
	}
	if err != nil {
		err = errors.Wrapf(err, "data.TxIncreaseCollectionCount error")
		return
	}
	return
}

func (d *Data) TxUpdateCollectionStatus(tx *gorm.DB, collId, status int) (err error) {
	err = tx.Exec(sqlUpdateCollectionStatus, status, collId).Error
	if err != nil {
		err = errors.Wrapf(err, "data.TxUpdateCollectionStatus error")
		return
	}
	return
}


