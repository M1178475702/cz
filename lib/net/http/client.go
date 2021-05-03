package http

import (
	"encoding/json"
	"fmt"
	"github.com/cockroachdb/errors"
	"strings"
)

type CzHttpClient struct {

}

type HttpCZResponse struct {
	Data interface{} `json:"data"`
	Msg  struct {
		Prompt string `json:"prompt"`
		Error  string `json:"error"`
	}
	Retcode int `json:"retcode"`
}

const (
	Success = 1
)

func (r *HttpCZResponse) IsSuccess() bool {
	return r.Retcode == Success
}

func (h *CzHttpClient) DoCzHttp(method string, path string, params map[string]string, data interface{}, res interface{}) (err error) {

	method = strings.ToUpper(method)
	url := path
	var raw []byte
	if method == "GET" {
		raw, err = HttpGet(url, h.prepareHeader(), params)
	} else if method == "POST" {
		raw, err = HttpPost(url, h.prepareHeader(), data, params)
	} else if method == "PUT" {
		raw, err = HttpPut(url, h.prepareHeader(), data, params)
	} else if method == "DELETE" {
		raw, err = HttpDelete(url, h.prepareHeader(), data, params)
	} else {
		return fmt.Errorf("unsupported method: %s", method)
	}


	resWrapper := &HttpCZResponse{
		Data: res,
	}
	err = json.Unmarshal(raw, resWrapper)
	if err != nil {
		return
	}
	if !resWrapper.IsSuccess() {
		err = errors.WithStack(err)
	}
	return nil
}

func (c *CzHttpClient) prepareHeader() map[string]string {
	return nil
}
