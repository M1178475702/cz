package http

import "encoding/json"

type Session interface {
	Set(key string, value interface{}) error
	Get(key string) (interface{}, error)
	GetInt(key string) (int, error)
	ToJson() (string, error)
	Init(raw string) error
}

type MemSessionImpl struct {
	c map[string]interface{}
}

func NewMemSession() Session {
	m := &MemSessionImpl{c: map[string]interface{}{}}
	return m
}

func (m *MemSessionImpl) Init(raw string) error {
	return json.Unmarshal([]byte(raw), &m.c)
}

func (m *MemSessionImpl) Set(key string, value interface{}) error {
	m.c[key] = value
	return nil
}

func (m *MemSessionImpl) Get(key string) (interface{}, error) {
	if v, ok := m.c[key]; ok {
		return v, nil
	} else {
		return nil, nil
	}
}

func (m *MemSessionImpl) GetInt(key string) (int, error) {
	v, err := m.Get(key)
	if err != nil {
		return 0, err
	}
	return int(v.(float64)), nil
}

func (m *MemSessionImpl) ToJson() (string, error) {
	bs, err := json.Marshal(m.c)
	return string(bs), err
}

type CzSession struct {
	UserId int `json:"user_id"`
}
