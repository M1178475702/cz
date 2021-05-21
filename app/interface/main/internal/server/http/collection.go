package http

import (
	pb "cz/app/service/main/collection/api/v1"
	"github.com/gin-gonic/gin"
	"time"
)

//route + param parse + call rpc ?

func SetSessionByCookie(ctx *gin.Context, session Session) {
	//str, err := session.ToJson()
	//if err != nil {
	//	return
	//}
	ctx.Header("Set-Cookie", ctx.GetHeader("cookie"))
	//ctx.SetCookie("xd_sid", str, 1000*3600*24, "/", "*", true, true)
}

func (g *GinHandler) getCollectionListHandler(ctx *gin.Context) {
	folder, err := QueryInt(ctx, "folder")
	if err != nil {
		Error(ctx, err)
		return
	}
	upDown := ctx.Query("upDown")
	if upDown == "" {
		upDown = "down"
	}
	lm := ctx.Query("lm")
	if lm == "" {
		lm = time.Now().Format("2006-01-02 15:04:05")
	}
	ps, err := QueryInt(ctx, "ps")
	if err != nil {
		Error(ctx, err)
		return
	}
	if ps == 0 {
		ps = 10
	}
	req := &pb.GetCollectionListReq{
		UserId: int32(ctx.GetInt("userId")),
		Folder: int32(folder),
		Ps:     int32(ps),
		Lm:     lm,
	}
	res, err := g.collectionClient.GetCollectionList(ctx.Request.Context(), req)
	if err != nil {
		Error(ctx, err)
		return
	}
	JSON(ctx, res)
}

func (g *GinHandler) doCollect(ctx *gin.Context) {
	args := struct {
		ItemId   int32  `json:"item_id"`
		Type     int32  `json:"type"`
		CollName string `json:"coll_name"`
		Folder   int32  `json:"folder"`
	}{}
	err := ctx.ShouldBindJSON(&args)
	if err != nil {
		Error(ctx, err)
		return
	}
	_, err = g.collectionClient.DoCollect(ctx.Request.Context(), &pb.DoCollectReq{
		UserId:   int32(ctx.GetInt("userId")),
		ItemId:   args.ItemId,
		CollType: args.Type,
		Folder:   args.Folder,
		CollName: args.CollName,
	})
	if err != nil {
		Error(ctx, err)
		return
	}
	JSON(ctx, nil)
}

func (g *GinHandler) undoCollect(ctx *gin.Context) {
	args := struct {
		CollId int32 `json:"coll_id"`
		ItemId int32 `json:"item_id"`
		Type   int32 `json:"type"`
	}{}
	err := ctx.ShouldBindJSON(&args)
	if err != nil {
		Error(ctx, err)
		return
	}
	_, err = g.collectionClient.UndoCollect(ctx.Request.Context(), &pb.UndoCollectReq{
		CollId:   args.CollId,
	})
	if err != nil {
		Error(ctx, err)
		return
	}
	JSON(ctx, nil)
}