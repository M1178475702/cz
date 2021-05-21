package http

import (
	"cz/app/interface/main/internal/conf"
	v1 "cz/app/service/main/collection/api/v1"
	http2 "cz/lib/net/http"
	"cz/lib/net/rpc"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/cockroachdb/errors"
	"github.com/gin-gonic/gin"
	"github.com/go-kratos/kratos/v2/log"
	"net/http"
	"strconv"
)

type GinHandler struct {
	log              *log.Helper
	collectionClient v1.CollectionClient
	endpoint         string
	c                *conf.Server
	engine           *gin.Engine
	czClient         *http2.CzHttpClient
}

func NewGinHandler(bc *conf.Bootstrap, logger log.Logger) *GinHandler {

	g := &GinHandler{
		log: log.NewHelper(fmt.Sprintf("%v-http", bc.Name), logger),
		czClient: &http2.CzHttpClient{Base: bc.Cz.Base},
	}
	clientConn, err := rpc.NewClient(bc.Client["collection_client"].Name)
	if err != nil {
		g.log.Errorf("初始化collection_client失败: %v", err)
		panic(err)
	}
	g.collectionClient = v1.NewCollectionClient(clientConn)
	router := gin.Default()
	g.engine = router
	collection := router.Group("/web/collection")
	{
		collection.GET("/list", VerifyUser, g.getCollectionListHandler)
		collection.POST("/do", VerifyUser, g.doCollect)
		collection.POST("/undo", VerifyUser, g.undoCollect)
	}
	router.NoRoute(g.CzHandler)
	return g
}

func (g *GinHandler) CzHandler(ctx *gin.Context) {

	res := map[string]interface{}{}

	cookieh, err := g.czClient.DoCzHttp(ctx.Request.Method, ctx.Request.URL.Path, &(ctx.Request.Header),nil, ctx.Request.Body, &res)
	if err != nil {
		Error(ctx, err)
		return
	}

	ctx.Header("Set-Cookie", cookieh)
	JSON(ctx, res)
}

func (g *GinHandler) Handler() http.Handler {
	return g.engine
}

type Response struct {
	Data interface{} `json:"data"`
	Msg  struct {
		Prompt string `json:"prompt"`
		Error  string `json:"error"`
	} `json:"msg"`
	Retcode int `json:"retcode"`
}

func Error(ctx *gin.Context, err error) {
	out, _ := json.Marshal(&Response{
		Data: nil,
		Msg: struct {
			Prompt string `json:"prompt"`
			Error  string `json:"error"`
		}{
			Prompt: "操作失败，请稍后重试",
			Error:  err.Error(),
		},
		Retcode: -500,
	})
	ctx.Data(200, "application/json", out)
	ctx.Abort()
}

func JSON(ctx *gin.Context, data interface{}) {
	res := &Response{
		Data: data,
		Msg: struct {
			Prompt string `json:"prompt"`
			Error  string `json:"error"`
		}{
			Prompt: "操作成功",
			Error:  "",
		},
		Retcode: 1,
	}

	out, err := json.Marshal(res)
	if err != nil {
		Error(ctx, err)
		return
	}
	ctx.Data(200, "application/json", out)
}

func QueryInt(ctx *gin.Context, key string) (int, error) {
	valuestr := ctx.Query(key)
	if len(valuestr) == 0 {
		return 0, nil
	}
	value, err := strconv.Atoi(valuestr)
	if err != nil {
		return 0, err
	}
	return value, nil
}

func ResolveSession(ctx *gin.Context) (Session, error) {
	value, err := ctx.Cookie("xd_sid")
	if err != nil {
		if err == http.ErrNoCookie {
			return nil, nil
		} else {
			return nil, err
		}
	}
	plain := make([]byte, len(value))
	n, err := base64.StdEncoding.Decode(plain, []byte(value))
	if err != nil {
		return nil, err
	}
	s := NewMemSession()
	err = s.Init(string(plain[:n]))
	if err != nil {
		return nil, err
	}
	return s, nil
}

func VerifyUser(ctx *gin.Context) {
	ctx.Set("userId", 0)
	session, err := ResolveSession(ctx)
	if err != nil {
		Error(ctx, err)
		return
	}
	if session == nil {
		Error(ctx, errors.New("用户未登录或凭证已过期"))
		return
	}
	var uid int
	if uid, err = session.GetInt("userId"); err != nil && uid != 0 {
		Error(ctx, errors.New("用户未登录或凭证已过期"))
		return
	}
	ctx.Set("userId", uid)
	SetSessionByCookie(ctx, session)

}
