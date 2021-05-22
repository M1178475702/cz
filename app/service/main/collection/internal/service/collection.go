
package service

import (
	"context"
	pe "cz/app/service/main/collection/api/errors"
	pb "cz/app/service/main/collection/api/v1"
	"cz/app/service/main/collection/internal/biz"
	"cz/app/service/main/collection/internal/conf"
	"fmt"
	"github.com/go-kratos/kratos/v2/errors"
	"github.com/go-kratos/kratos/v2/log"
)

const (
	Domain = "Collection"
)

type CollectionService struct {
	pb.UnimplementedCollectionServer
	biz *biz.CollectionBiz
	log *log.Helper
}

func NewCollectionService(bc *conf.Bootstrap, biz *biz.CollectionBiz, logger log.Logger) *CollectionService {
	return &CollectionService{
		biz: biz,
		log: log.NewHelper(fmt.Sprintf("%v-service", bc.Name), logger),
	}
}

func (s *CollectionService) GetCollectionList(ctx context.Context, req *pb.GetCollectionListReq) (*pb.GetCollectionListRes, error) {
	items, err := s.biz.GetCollectionList(ctx, int(req.UserId), int(req.Folder), int(req.Ps), req.Lm)
	if err != nil {
		return nil, err
	}
	res := &pb.GetCollectionListRes{}
	res.List = make([]*pb.ModelCollectionListItem, len(items))
	for i, item := range items {
		res.List[i] = &pb.ModelCollectionListItem{
			CollId:     int32(item.CollId),
			CollName:   item.CollName,
			ItemId:     int64(item.ItemId),
			ModifyTime: item.ModifyTime,
		}
	}
	return res, nil
}
func (s *CollectionService) GetCollection(ctx context.Context, req *pb.GetCollectionReq) (*pb.GetCollectionRes, error) {
	collection, err := s.biz.GetCollection(ctx, int(req.UserId), int(req.ItemId), int(req.CollType))
	if err != nil {
		return nil, errors.Internal(pe.Errors_InternalError, "")
	}
	if collection == nil {
		return nil, errors.NotFound(pe.Collection_CollectionNotExist.String(),"")
	}
	return &pb.GetCollectionRes{
		CollId:     int32(collection.CollId),
		UserId:     int32(collection.UserId),
		CollName:   collection.CollName,
		Folder:     int64(collection.Folder),
		ItemId:     int64(collection.ItemId),
		CollType:   int32(collection.CollType),
		Status:     int32(collection.Status),
		CreateTime: collection.CreateTime,
		ModifyTime: collection.ModifyName,
	}, nil
}
func (s *CollectionService) DoCollect(ctx context.Context, req *pb.DoCollectReq) (*pb.DoCollectRes, error) {
	err := s.biz.DoCollect(ctx, int(req.UserId), int(req.ItemId), int(req.CollType), int(req.Folder), req.CollName)
	if err != nil {
		s.log.Error(err)
		return nil, errors.Internal(pe.Errors_InternalError, "err: %v", err)
	}
	return &pb.DoCollectRes{}, nil
}
func (s *CollectionService) UndoCollect(ctx context.Context, req *pb.UndoCollectReq) (*pb.UndoCollectRes, error) {
	err := s.biz.UndoCollect(ctx, int(req.CollId))
	s.log.Error(err)
	if err != nil {
		return nil, errors.Internal(pe.Errors_InternalError, "")
	}
	return &pb.UndoCollectRes{}, nil
}
func (s *CollectionService) IsCollected(ctx context.Context, req *pb.IsCollectedReq) (*pb.IsCollectedRes, error) {
	isCollected, err := s.biz.IsCollected(ctx, int(req.UserId), int(req.ItemId), int(req.CollType))
	s.log.Error(err)
	if err != nil {
		return nil, errors.Internal(pe.Errors_InternalError, "")
	}
	return &pb.IsCollectedRes{
		IsCollected: isCollected,
	}, nil
}
