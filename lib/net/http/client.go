package http

import (
	"encoding/json"
	"fmt"
	"github.com/cockroachdb/errors"
	"net/http"
	"strings"
)

type CzHttpClient struct {
	Base string
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

func (h *CzHttpClient) DoCzHttp(method string, path string, header *http.Header, params map[string]string, data interface{}, res interface{}) (cookieh string, err error) {

	method = strings.ToUpper(method)
	url := h.Base + path
	var raw []byte
	if method == "GET" {
		raw, cookieh, err = HttpGet(url, header, params)
	} else if method == "POST" {
		raw, cookieh, err = HttpPost(url, header, data, params)
	} else if method == "PUT" {
		raw, cookieh, err = HttpPut(url, header, data, params)
	} else if method == "DELETE" {
		raw, cookieh, err = HttpDelete(url, header, data, params)
	} else {
		return "", fmt.Errorf("unsupported method: %s", method)
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
	return cookieh, err
}

func (c *CzHttpClient) prepareHeader() map[string]string {
	return nil
}
