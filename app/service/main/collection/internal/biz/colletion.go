package biz

import (
	"context"
	"cz/app/service/main/collection/internal/data"
	"cz/app/service/main/collection/internal/model"
	"github.com/cockroachdb/errors"
	"github.com/go-kratos/kratos/v2/log"
)

type CollectionBiz struct {
	dao *data.Data
	log  *log.Helper
}

const (
	CollTypeDo = 1
	CollTypeUndo = 2
)


func NewCollectionBiz(dao *data.Data, logger log.Logger) *CollectionBiz {
	biz := &CollectionBiz{
		dao: dao,
		log: log.NewHelper("collection.biz", logger),
	}
	return biz
}

func (b *CollectionBiz) GetCollectionList(ctx context.Context, userId, folder, ps int, lm string) (items []*model.CollectionListItem, err error){
	items, err = b.dao.GetCollectionList(ctx, userId, folder, CollTypeDo, ps, lm)
	if err != nil {
		b.log.Error(err)
		return
	}
	return
}

func (b *CollectionBiz) GetCollection(ctx context.Context, userId, itemId, collType int) (collection *model.Collection, err error){
	collection, err = b.dao.GetCollectionByUIC(ctx, userId, itemId, collType, CollTypeDo)
	if err != nil {
		b.log.Error(err)
		return
	}
	return
}

func (b *CollectionBiz) DoCollect(ctx context.Context, userId, itemId, collType, folder int, collName string) (err error) {
	//check collection is exist
	collection, err := b.dao.GetCollectionByUIC(ctx, userId, itemId, collType, CollTypeDo)
	if err != nil {
		b.log.Error()
		return
	}
	tx, clean, err := b.dao.BeginTx(ctx)
	if err != nil {
		return
	}
	defer clean()

	//create or update status
	if collection == nil {
		collection, err = b.dao.TxCreateCollection(tx, userId, itemId, collType, folder, collName)
		if err != nil {
			return
		}
	} else {
		if collection.Status == CollTypeDo {
			err = errors.Newf("已经收藏过了")
			return
		} else {
			err = b.dao.TxUpdateCollectionStatus(tx, collection.CollId, CollTypeUndo)
			if err != nil {
				return
			}
		}
	}
	//increase collected count of article
	err = b.dao.TxIncreaseCollectionCount(tx, collection.CollId, 1)
	if err != nil {
		return
	}
	return
}

func (b *CollectionBiz) UndoCollect(ctx context.Context, collId int) (err error) {
	collection, err := b.dao.GetCollectionById(ctx, collId)
	if err != nil {
		return
	}
	if collection == nil {
		err = errors.Newf("coll_id %v don't exist", collId)
		return
	}

	tx, clean, err := b.dao.BeginTx(ctx)
	if err != nil {
		return
	}
	defer clean()

	err = b.dao.TxUpdateCollectionStatus(tx, collId, CollTypeUndo)
	if err != nil {
		return
	}
	err = b.dao.TxIncreaseCollectionCount(tx, collection.CollId, -1)
	if err != nil {
		return
	}

	return
}


func (b *CollectionBiz) IsCollected(ctx context.Context, userId int, itemId, collType int) (isCollected bool,err error) {
	collection, err := b.dao.GetCollectionByUIC(ctx, userId, itemId, collType, CollTypeDo)
	if err != nil {
		return
	}
	if collection == nil {
		isCollected = false
		return
	}
	isCollected = true
	return
}
