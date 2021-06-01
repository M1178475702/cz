package util

import (
	"reflect"
	"time"
)

var Loc *time.Location

func init() {

	Loc, _ = time.LoadLocation("Asia/Shanghai")
}

func IsPtr(p interface{}) bool {
	return reflect.TypeOf(p).Kind() == reflect.Ptr
}

func DbTimeParse(raw string) (string, error) {
	t, err := time.ParseInLocation("2006-01-02T15:04:05Z", raw, Loc)
	if err != nil {
		return "", err
	}
	return t.Format("2006-01-02 15:04:05"), nil
}