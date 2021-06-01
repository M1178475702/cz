package biz

import (
	"context"
	"cz/app/service/main/collection/internal/conf"
	"cz/app/service/main/collection/internal/data"
	"cz/app/service/main/collection/internal/model"
	"fmt"
	"github.com/cockroachdb/errors"
	"github.com/go-kratos/kratos/v2/log"
	"time"
)

type CollectionBiz struct {
	dao *data.Data
	log *log.Helper
}

const (
	CollTypeDo   = 1
	CollTypeUndo = 2
)

func NewCollectionBiz(bc *conf.Bootstrap, dao *data.Data, logger log.Logger) *CollectionBiz {
	biz := &CollectionBiz{
		dao: dao,
		log: log.NewHelper(fmt.Sprintf("%v-biz", bc.Name), logger),
	}
	return biz
}

func (b *CollectionBiz) GetCollectionList(ctx context.Context, userId, folder, ps int, lm string) (items []*model.CollectionListItem, newLm string, err error) {
	items, err = b.dao.GetCollectionList(ctx, userId, folder, CollTypeDo, ps, lm)
	if err != nil {
		return
	}
	if len(items) != 0 {
		newLm = items[len(items)-1].ModifyTime
	} else {
		newLm = time.Now().Format("2006-01-02 15:04:05")
	}
	return
}

func (b *CollectionBiz) GetCollectionListByOffset(ctx context.Context, userId, folder, offset, ps int) (items []*model.CollectionListItem, count int, err error) {
	items, err = b.dao.GetCollectionListByOffset(ctx, userId, folder, CollTypeDo, offset, ps)
	if err != nil {
		return
	}
	totalCollectionCount, err := b.dao.GetTotalCollectionCount(ctx, userId, folder, CollTypeDo)
	if err != nil {
		return nil, 0, err
	}
	count = int(totalCollectionCount)
	return
}

func (b *CollectionBiz) GetCollection(ctx context.Context, userId, itemId, collType int) (collection *model.Collection, err error) {
	collection, err = b.dao.GetCollectionByUIC(ctx, userId, itemId, collType, CollTypeDo)
	if err != nil {
		b.log.Error(err)
		return
	}
	return
}

func (b *CollectionBiz) DoCollect(ctx context.Context, userId, itemId, collType, folder int, collName string) (err error) {
	//check api is exist
	collection, err := b.dao.GetCollectionByUIC(ctx, userId, itemId, collType, CollTypeDo)
	if err != nil {
		b.log.Error(err)
		return
	}
	tx, clean, err := b.dao.BeginTx(ctx)
	if err != nil {
		return
	}
	defer clean(&err)

	//create or update status
	if collection == nil {
		collection, err = b.dao.TxCreateCollection(tx, userId, itemId, collType, folder, collName)
		if err != nil {
			return
		}
		err = b.dao.TxCreateCollectionCount(tx, itemId, collType)
		if err != nil {
			return
		}
	} else {
		if collection.Status == CollTypeDo {
			//err = errors.Newf("已经收藏过了")
			return
		} else {
			err = b.dao.TxUpdateCollectionStatus(tx, collection.CollId, CollTypeDo)
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
	defer clean(&err)

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

func (b *CollectionBiz) IsCollected(ctx context.Context, userId int, itemId, collType int) (isCollected bool, err error) {
	collection, err := b.dao.GetCollectionByUIC(ctx, userId, itemId, collType, CollTypeDo)
	if err != nil {
		b.log.Error(err)
		return
	}
	if collection == nil {
		isCollected = false
		return
	}
	isCollected = true
	return
}
