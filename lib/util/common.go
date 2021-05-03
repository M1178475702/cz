package util

import "reflect"

func IsPtr(p interface{}) bool {
	return reflect.TypeOf(p).Kind() == reflect.Ptr
}