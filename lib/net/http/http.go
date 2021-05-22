package http

import (
	"bytes"
	"cz/lib/util"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	url2 "net/url"
	"strings"
)

//HttpGet receives request and returns body of response in []byte
func HttpGet(url string, headerRaw interface{}, params map[string]string) (resData []byte, cookieh string, err error) {
	url = ParseQueryParams(url, params)
	return DoRequest("GET", url, headerRaw, nil)
}

//HttpPost type of data should be string or map[string][string]
func HttpPost(url string, headerRaw interface{}, dataRaw interface{}, params map[string]string) (resData []byte, cookieh string, err error) {
	url = ParseQueryParams(url, params)
	data, err := ParseData(dataRaw)
	if err != nil {
		return nil,"",  err
	}
	return DoRequest("POST", url, headerRaw, data)
}

func HttpDelete(url string, headerRaw interface{}, dataRaw interface{}, params map[string]string) (resData []byte, cookieh string, err error) {
	url = ParseQueryParams(url, params)
	data, err := ParseData(dataRaw)
	if err != nil {
		return nil, "", err
	}
	return DoRequest("DELETE", url, headerRaw, data)
}

func HttpPut(url string, headerRaw interface{}, dataRaw interface{}, params map[string]string) (resData []byte, cookieh string, err error) {
	url = ParseQueryParams(url, params)
	data, err := ParseData(dataRaw)
	if err != nil {
		return nil, "", err
	}
	return DoRequest("PUT", url, headerRaw, data)
}

func HttpPatch(url string, headerRaw interface{}, dataRaw interface{}, params map[string]string) (resData []byte, cookieh string, err error) {
	url = ParseQueryParams(url, params)
	data, err := ParseData(dataRaw)
	if err != nil {
		return nil, "", err
	}
	return DoRequest("PATCH", url, headerRaw, data)
}

func DoRequest(method, url string, headerRaw interface{}, data io.Reader) (resData []byte, cookieh string, err error) {
	req, err := http.NewRequest(method, url, data)
	if err != nil {
		return nil, "", err
	}

	err = WriteHeader(req, headerRaw)
	if err != nil {
		return nil, "", err
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, "", err
	}
	cookieh = res.Header.Get("Set-Cookie")
	resData, err = io.ReadAll(res.Body)
	if err != nil {
		return nil, "", err
	}
	return resData, cookieh, nil
}

func ParseData(dataRaw interface{}) (data io.Reader, err error) {
	//parse data
	if dataRaw == nil {
		return nil, nil
	} else if dataStr, ok := dataRaw.(string); ok {
		data = bytes.NewBuffer([]byte(dataStr))
		return data, nil
	} else if m, ok := dataRaw.(map[string]string); ok {
		bs, err := json.Marshal(m)
		if err != nil {
			return nil, err
		}
		data = bytes.NewBuffer(bs)
		return data, nil
	} else if r, ok := dataRaw.(io.Reader); ok {
		return r, nil
	} else if util.IsPtr(dataRaw) {
		bs, err := json.Marshal(dataRaw)
		if err != nil {
			return nil, err
		}
		data = bytes.NewBuffer(bs)
		return data, nil
	} else {
		return nil, fmt.Errorf("unknown data type: %v", dataRaw)
	}
}

func ParseQueryParams(url string, params map[string]string) string {
	if len(params) != 0 {
		url += "?"
		query := url2.Values{}
		for k, v := range params {
			query.Set(k, v)
		}
		url += query.Encode()
	}
	return url
}

func WriteHeader(req *http.Request, headerRaw interface{}) (err error) {
	if header, ok := headerRaw.(*http.Header); ok {
		req.Header = *header
		return nil
	} else if headerStr, ok := headerRaw.(string); ok {
		err = WriteHeaderStr(req, headerStr)
		if err != nil {
			return err
		}
	} else if m, ok := headerRaw.(map[string]string); ok {
		header := http.Header{}
		for k, v := range m {
			header.Set(k, v)
		}
		req.Header = header
	} else {
		return fmt.Errorf("unknown header type: %v", headerRaw)
	}
	return err
}

func WriteHeaderStr(req *http.Request, headerRaw string) error {
	headers := strings.Split(headerRaw, "\n")
	for _, hs := range headers {
		pair := strings.Split(hs, ":")
		req.Header.Set(strings.TrimSpace(pair[0]), strings.TrimSpace(pair[1]))
	}
	return nil
}
