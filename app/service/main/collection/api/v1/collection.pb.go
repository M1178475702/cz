// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.26.0
// 	protoc        v3.15.8
// source: collection.proto

package v1

import (
	_ "google.golang.org/genproto/googleapis/api/annotations"
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

// The request message containing the user's name.
type GetCollectionListReq struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	UserId int32  `protobuf:"varint,1,opt,name=userId,proto3" json:"userId,omitempty"`
	Folder int32  `protobuf:"varint,2,opt,name=folder,proto3" json:"folder,omitempty"`
	Ps     int32  `protobuf:"varint,3,opt,name=ps,proto3" json:"ps,omitempty"`
	Lm     string `protobuf:"bytes,4,opt,name=lm,proto3" json:"lm,omitempty"`
}

func (x *GetCollectionListReq) Reset() {
	*x = GetCollectionListReq{}
	if protoimpl.UnsafeEnabled {
		mi := &file_collection_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetCollectionListReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetCollectionListReq) ProtoMessage() {}

func (x *GetCollectionListReq) ProtoReflect() protoreflect.Message {
	mi := &file_collection_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetCollectionListReq.ProtoReflect.Descriptor instead.
func (*GetCollectionListReq) Descriptor() ([]byte, []int) {
	return file_collection_proto_rawDescGZIP(), []int{0}
}

func (x *GetCollectionListReq) GetUserId() int32 {
	if x != nil {
		return x.UserId
	}
	return 0
}

func (x *GetCollectionListReq) GetFolder() int32 {
	if x != nil {
		return x.Folder
	}
	return 0
}

func (x *GetCollectionListReq) GetPs() int32 {
	if x != nil {
		return x.Ps
	}
	return 0
}

func (x *GetCollectionListReq) GetLm() string {
	if x != nil {
		return x.Lm
	}
	return ""
}

type ModelCollectionListItem struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	CollId     int32  `protobuf:"varint,1,opt,name=collId,proto3" json:"collId,omitempty"`
	CollName   string `protobuf:"bytes,3,opt,name=collName,proto3" json:"collName,omitempty"`
	ItemId     int64  `protobuf:"varint,5,opt,name=itemId,proto3" json:"itemId,omitempty"`
	ModifyTime string `protobuf:"bytes,9,opt,name=ModifyTime,proto3" json:"ModifyTime,omitempty"`
}

func (x *ModelCollectionListItem) Reset() {
	*x = ModelCollectionListItem{}
	if protoimpl.UnsafeEnabled {
		mi := &file_collection_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ModelCollectionListItem) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ModelCollectionListItem) ProtoMessage() {}

func (x *ModelCollectionListItem) ProtoReflect() protoreflect.Message {
	mi := &file_collection_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ModelCollectionListItem.ProtoReflect.Descriptor instead.
func (*ModelCollectionListItem) Descriptor() ([]byte, []int) {
	return file_collection_proto_rawDescGZIP(), []int{1}
}

func (x *ModelCollectionListItem) GetCollId() int32 {
	if x != nil {
		return x.CollId
	}
	return 0
}

func (x *ModelCollectionListItem) GetCollName() string {
	if x != nil {
		return x.CollName
	}
	return ""
}

func (x *ModelCollectionListItem) GetItemId() int64 {
	if x != nil {
		return x.ItemId
	}
	return 0
}

func (x *ModelCollectionListItem) GetModifyTime() string {
	if x != nil {
		return x.ModifyTime
	}
	return ""
}

// The response message containing the greetings
type GetCollectionListRes struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	List []*ModelCollectionListItem `protobuf:"bytes,1,rep,name=list,proto3" json:"list,omitempty"`
	Lm   string                     `protobuf:"bytes,2,opt,name=lm,proto3" json:"lm,omitempty"`
}

func (x *GetCollectionListRes) Reset() {
	*x = GetCollectionListRes{}
	if protoimpl.UnsafeEnabled {
		mi := &file_collection_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetCollectionListRes) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetCollectionListRes) ProtoMessage() {}

func (x *GetCollectionListRes) ProtoReflect() protoreflect.Message {
	mi := &file_collection_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetCollectionListRes.ProtoReflect.Descriptor instead.
func (*GetCollectionListRes) Descriptor() ([]byte, []int) {
	return file_collection_proto_rawDescGZIP(), []int{2}
}

func (x *GetCollectionListRes) GetList() []*ModelCollectionListItem {
	if x != nil {
		return x.List
	}
	return nil
}

func (x *GetCollectionListRes) GetLm() string {
	if x != nil {
		return x.Lm
	}
	return ""
}

type GetCollectionReq struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	UserId   int32 `protobuf:"varint,1,opt,name=userId,proto3" json:"userId,omitempty"`
	ItemId   int32 `protobuf:"varint,2,opt,name=itemId,proto3" json:"itemId,omitempty"`
	CollType int32 `protobuf:"varint,3,opt,name=collType,proto3" json:"collType,omitempty"`
}

func (x *GetCollectionReq) Reset() {
	*x = GetCollectionReq{}
	if protoimpl.UnsafeEnabled {
		mi := &file_collection_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetCollectionReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetCollectionReq) ProtoMessage() {}

func (x *GetCollectionReq) ProtoReflect() protoreflect.Message {
	mi := &file_collection_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetCollectionReq.ProtoReflect.Descriptor instead.
func (*GetCollectionReq) Descriptor() ([]byte, []int) {
	return file_collection_proto_rawDescGZIP(), []int{3}
}

func (x *GetCollectionReq) GetUserId() int32 {
	if x != nil {
		return x.UserId
	}
	return 0
}

func (x *GetCollectionReq) GetItemId() int32 {
	if x != nil {
		return x.ItemId
	}
	return 0
}

func (x *GetCollectionReq) GetCollType() int32 {
	if x != nil {
		return x.CollType
	}
	return 0
}

type GetCollectionRes struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	CollId     int32  `protobuf:"varint,1,opt,name=collId,proto3" json:"collId,omitempty"`
	UserId     int32  `protobuf:"varint,2,opt,name=userId,proto3" json:"userId,omitempty"`
	CollName   string `protobuf:"bytes,3,opt,name=collName,proto3" json:"collName,omitempty"`
	Folder     int64  `protobuf:"varint,4,opt,name=folder,proto3" json:"folder,omitempty"`
	ItemId     int64  `protobuf:"varint,5,opt,name=itemId,proto3" json:"itemId,omitempty"`
	CollType   int32  `protobuf:"varint,6,opt,name=collType,proto3" json:"collType,omitempty"`
	Status     int32  `protobuf:"varint,7,opt,name=status,proto3" json:"status,omitempty"`
	CreateTime string `protobuf:"bytes,8,opt,name=CreateTime,proto3" json:"CreateTime,omitempty"`
	ModifyTime string `protobuf:"bytes,9,opt,name=ModifyTime,proto3" json:"ModifyTime,omitempty"`
}

func (x *GetCollectionRes) Reset() {
	*x = GetCollectionRes{}
	if protoimpl.UnsafeEnabled {
		mi := &file_collection_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetCollectionRes) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetCollectionRes) ProtoMessage() {}

func (x *GetCollectionRes) ProtoReflect() protoreflect.Message {
	mi := &file_collection_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetCollectionRes.ProtoReflect.Descriptor instead.
func (*GetCollectionRes) Descriptor() ([]byte, []int) {
	return file_collection_proto_rawDescGZIP(), []int{4}
}

func (x *GetCollectionRes) GetCollId() int32 {
	if x != nil {
		return x.CollId
	}
	return 0
}

func (x *GetCollectionRes) GetUserId() int32 {
	if x != nil {
		return x.UserId
	}
	return 0
}

func (x *GetCollectionRes) GetCollName() string {
	if x != nil {
		return x.CollName
	}
	return ""
}

func (x *GetCollectionRes) GetFolder() int64 {
	if x != nil {
		return x.Folder
	}
	return 0
}

func (x *GetCollectionRes) GetItemId() int64 {
	if x != nil {
		return x.ItemId
	}
	return 0
}

func (x *GetCollectionRes) GetCollType() int32 {
	if x != nil {
		return x.CollType
	}
	return 0
}

func (x *GetCollectionRes) GetStatus() int32 {
	if x != nil {
		return x.Status
	}
	return 0
}

func (x *GetCollectionRes) GetCreateTime() string {
	if x != nil {
		return x.CreateTime
	}
	return ""
}

func (x *GetCollectionRes) GetModifyTime() string {
	if x != nil {
		return x.ModifyTime
	}
	return ""
}

type DoCollectReq struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	UserId   int32  `protobuf:"varint,1,opt,name=userId,proto3" json:"userId,omitempty"`
	ItemId   int32  `protobuf:"varint,2,opt,name=itemId,proto3" json:"itemId,omitempty"`
	CollType int32  `protobuf:"varint,3,opt,name=collType,proto3" json:"collType,omitempty"`
	Folder   int32  `protobuf:"varint,4,opt,name=folder,proto3" json:"folder,omitempty"`
	CollName string `protobuf:"bytes,5,opt,name=collName,proto3" json:"collName,omitempty"`
}

func (x *DoCollectReq) Reset() {
	*x = DoCollectReq{}
	if protoimpl.UnsafeEnabled {
		mi := &file_collection_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *DoCollectReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*DoCollectReq) ProtoMessage() {}

func (x *DoCollectReq) ProtoReflect() protoreflect.Message {
	mi := &file_collection_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use DoCollectReq.ProtoReflect.Descriptor instead.
func (*DoCollectReq) Descriptor() ([]byte, []int) {
	return file_collection_proto_rawDescGZIP(), []int{5}
}

func (x *DoCollectReq) GetUserId() int32 {
	if x != nil {
		return x.UserId
	}
	return 0
}

func (x *DoCollectReq) GetItemId() int32 {
	if x != nil {
		return x.ItemId
	}
	return 0
}

func (x *DoCollectReq) GetCollType() int32 {
	if x != nil {
		return x.CollType
	}
	return 0
}

func (x *DoCollectReq) GetFolder() int32 {
	if x != nil {
		return x.Folder
	}
	return 0
}

func (x *DoCollectReq) GetCollName() string {
	if x != nil {
		return x.CollName
	}
	return ""
}

type DoCollectRes struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields
}

func (x *DoCollectRes) Reset() {
	*x = DoCollectRes{}
	if protoimpl.UnsafeEnabled {
		mi := &file_collection_proto_msgTypes[6]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *DoCollectRes) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*DoCollectRes) ProtoMessage() {}

func (x *DoCollectRes) ProtoReflect() protoreflect.Message {
	mi := &file_collection_proto_msgTypes[6]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use DoCollectRes.ProtoReflect.Descriptor instead.
func (*DoCollectRes) Descriptor() ([]byte, []int) {
	return file_collection_proto_rawDescGZIP(), []int{6}
}

type UndoCollectReq struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	CollId int32 `protobuf:"varint,1,opt,name=collId,proto3" json:"collId,omitempty"`
}

func (x *UndoCollectReq) Reset() {
	*x = UndoCollectReq{}
	if protoimpl.UnsafeEnabled {
		mi := &file_collection_proto_msgTypes[7]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *UndoCollectReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UndoCollectReq) ProtoMessage() {}

func (x *UndoCollectReq) ProtoReflect() protoreflect.Message {
	mi := &file_collection_proto_msgTypes[7]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UndoCollectReq.ProtoReflect.Descriptor instead.
func (*UndoCollectReq) Descriptor() ([]byte, []int) {
	return file_collection_proto_rawDescGZIP(), []int{7}
}

func (x *UndoCollectReq) GetCollId() int32 {
	if x != nil {
		return x.CollId
	}
	return 0
}

type UndoCollectRes struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields
}

func (x *UndoCollectRes) Reset() {
	*x = UndoCollectRes{}
	if protoimpl.UnsafeEnabled {
		mi := &file_collection_proto_msgTypes[8]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *UndoCollectRes) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UndoCollectRes) ProtoMessage() {}

func (x *UndoCollectRes) ProtoReflect() protoreflect.Message {
	mi := &file_collection_proto_msgTypes[8]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UndoCollectRes.ProtoReflect.Descriptor instead.
func (*UndoCollectRes) Descriptor() ([]byte, []int) {
	return file_collection_proto_rawDescGZIP(), []int{8}
}

type IsCollectedReq struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	ItemId   int32 `protobuf:"varint,1,opt,name=itemId,proto3" json:"itemId,omitempty"`
	CollType int32 `protobuf:"varint,2,opt,name=collType,proto3" json:"collType,omitempty"`
	UserId   int32 `protobuf:"varint,3,opt,name=userId,proto3" json:"userId,omitempty"`
}

func (x *IsCollectedReq) Reset() {
	*x = IsCollectedReq{}
	if protoimpl.UnsafeEnabled {
		mi := &file_collection_proto_msgTypes[9]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *IsCollectedReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*IsCollectedReq) ProtoMessage() {}

func (x *IsCollectedReq) ProtoReflect() protoreflect.Message {
	mi := &file_collection_proto_msgTypes[9]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use IsCollectedReq.ProtoReflect.Descriptor instead.
func (*IsCollectedReq) Descriptor() ([]byte, []int) {
	return file_collection_proto_rawDescGZIP(), []int{9}
}

func (x *IsCollectedReq) GetItemId() int32 {
	if x != nil {
		return x.ItemId
	}
	return 0
}

func (x *IsCollectedReq) GetCollType() int32 {
	if x != nil {
		return x.CollType
	}
	return 0
}

func (x *IsCollectedReq) GetUserId() int32 {
	if x != nil {
		return x.UserId
	}
	return 0
}

type IsCollectedRes struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	IsCollected bool `protobuf:"varint,1,opt,name=isCollected,proto3" json:"isCollected,omitempty"`
}

func (x *IsCollectedRes) Reset() {
	*x = IsCollectedRes{}
	if protoimpl.UnsafeEnabled {
		mi := &file_collection_proto_msgTypes[10]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *IsCollectedRes) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*IsCollectedRes) ProtoMessage() {}

func (x *IsCollectedRes) ProtoReflect() protoreflect.Message {
	mi := &file_collection_proto_msgTypes[10]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use IsCollectedRes.ProtoReflect.Descriptor instead.
func (*IsCollectedRes) Descriptor() ([]byte, []int) {
	return file_collection_proto_rawDescGZIP(), []int{10}
}

func (x *IsCollectedRes) GetIsCollected() bool {
	if x != nil {
		return x.IsCollected
	}
	return false
}

var File_collection_proto protoreflect.FileDescriptor

var file_collection_proto_rawDesc = []byte{
	0x0a, 0x10, 0x63, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x12, 0x10, 0x63, 0x7a, 0x2e, 0x63, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f,
	0x6e, 0x2e, 0x76, 0x31, 0x1a, 0x1c, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x61, 0x70, 0x69,
	0x2f, 0x61, 0x6e, 0x6e, 0x6f, 0x74, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x73, 0x2e, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x22, 0x66, 0x0a, 0x14, 0x47, 0x65, 0x74, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74,
	0x69, 0x6f, 0x6e, 0x4c, 0x69, 0x73, 0x74, 0x52, 0x65, 0x71, 0x12, 0x16, 0x0a, 0x06, 0x75, 0x73,
	0x65, 0x72, 0x49, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x05, 0x52, 0x06, 0x75, 0x73, 0x65, 0x72,
	0x49, 0x64, 0x12, 0x16, 0x0a, 0x06, 0x66, 0x6f, 0x6c, 0x64, 0x65, 0x72, 0x18, 0x02, 0x20, 0x01,
	0x28, 0x05, 0x52, 0x06, 0x66, 0x6f, 0x6c, 0x64, 0x65, 0x72, 0x12, 0x0e, 0x0a, 0x02, 0x70, 0x73,
	0x18, 0x03, 0x20, 0x01, 0x28, 0x05, 0x52, 0x02, 0x70, 0x73, 0x12, 0x0e, 0x0a, 0x02, 0x6c, 0x6d,
	0x18, 0x04, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x6c, 0x6d, 0x22, 0x85, 0x01, 0x0a, 0x17, 0x4d,
	0x6f, 0x64, 0x65, 0x6c, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x4c, 0x69,
	0x73, 0x74, 0x49, 0x74, 0x65, 0x6d, 0x12, 0x16, 0x0a, 0x06, 0x63, 0x6f, 0x6c, 0x6c, 0x49, 0x64,
	0x18, 0x01, 0x20, 0x01, 0x28, 0x05, 0x52, 0x06, 0x63, 0x6f, 0x6c, 0x6c, 0x49, 0x64, 0x12, 0x1a,
	0x0a, 0x08, 0x63, 0x6f, 0x6c, 0x6c, 0x4e, 0x61, 0x6d, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x08, 0x63, 0x6f, 0x6c, 0x6c, 0x4e, 0x61, 0x6d, 0x65, 0x12, 0x16, 0x0a, 0x06, 0x69, 0x74,
	0x65, 0x6d, 0x49, 0x64, 0x18, 0x05, 0x20, 0x01, 0x28, 0x03, 0x52, 0x06, 0x69, 0x74, 0x65, 0x6d,
	0x49, 0x64, 0x12, 0x1e, 0x0a, 0x0a, 0x4d, 0x6f, 0x64, 0x69, 0x66, 0x79, 0x54, 0x69, 0x6d, 0x65,
	0x18, 0x09, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0a, 0x4d, 0x6f, 0x64, 0x69, 0x66, 0x79, 0x54, 0x69,
	0x6d, 0x65, 0x22, 0x65, 0x0a, 0x14, 0x47, 0x65, 0x74, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74,
	0x69, 0x6f, 0x6e, 0x4c, 0x69, 0x73, 0x74, 0x52, 0x65, 0x73, 0x12, 0x3d, 0x0a, 0x04, 0x6c, 0x69,
	0x73, 0x74, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x29, 0x2e, 0x63, 0x7a, 0x2e, 0x63, 0x6f,
	0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x76, 0x31, 0x2e, 0x4d, 0x6f, 0x64, 0x65,
	0x6c, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x4c, 0x69, 0x73, 0x74, 0x49,
	0x74, 0x65, 0x6d, 0x52, 0x04, 0x6c, 0x69, 0x73, 0x74, 0x12, 0x0e, 0x0a, 0x02, 0x6c, 0x6d, 0x18,
	0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x6c, 0x6d, 0x22, 0x5e, 0x0a, 0x10, 0x47, 0x65, 0x74,
	0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x52, 0x65, 0x71, 0x12, 0x16, 0x0a,
	0x06, 0x75, 0x73, 0x65, 0x72, 0x49, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x05, 0x52, 0x06, 0x75,
	0x73, 0x65, 0x72, 0x49, 0x64, 0x12, 0x16, 0x0a, 0x06, 0x69, 0x74, 0x65, 0x6d, 0x49, 0x64, 0x18,
	0x02, 0x20, 0x01, 0x28, 0x05, 0x52, 0x06, 0x69, 0x74, 0x65, 0x6d, 0x49, 0x64, 0x12, 0x1a, 0x0a,
	0x08, 0x63, 0x6f, 0x6c, 0x6c, 0x54, 0x79, 0x70, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x05, 0x52,
	0x08, 0x63, 0x6f, 0x6c, 0x6c, 0x54, 0x79, 0x70, 0x65, 0x22, 0x82, 0x02, 0x0a, 0x10, 0x47, 0x65,
	0x74, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x52, 0x65, 0x73, 0x12, 0x16,
	0x0a, 0x06, 0x63, 0x6f, 0x6c, 0x6c, 0x49, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x05, 0x52, 0x06,
	0x63, 0x6f, 0x6c, 0x6c, 0x49, 0x64, 0x12, 0x16, 0x0a, 0x06, 0x75, 0x73, 0x65, 0x72, 0x49, 0x64,
	0x18, 0x02, 0x20, 0x01, 0x28, 0x05, 0x52, 0x06, 0x75, 0x73, 0x65, 0x72, 0x49, 0x64, 0x12, 0x1a,
	0x0a, 0x08, 0x63, 0x6f, 0x6c, 0x6c, 0x4e, 0x61, 0x6d, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x08, 0x63, 0x6f, 0x6c, 0x6c, 0x4e, 0x61, 0x6d, 0x65, 0x12, 0x16, 0x0a, 0x06, 0x66, 0x6f,
	0x6c, 0x64, 0x65, 0x72, 0x18, 0x04, 0x20, 0x01, 0x28, 0x03, 0x52, 0x06, 0x66, 0x6f, 0x6c, 0x64,
	0x65, 0x72, 0x12, 0x16, 0x0a, 0x06, 0x69, 0x74, 0x65, 0x6d, 0x49, 0x64, 0x18, 0x05, 0x20, 0x01,
	0x28, 0x03, 0x52, 0x06, 0x69, 0x74, 0x65, 0x6d, 0x49, 0x64, 0x12, 0x1a, 0x0a, 0x08, 0x63, 0x6f,
	0x6c, 0x6c, 0x54, 0x79, 0x70, 0x65, 0x18, 0x06, 0x20, 0x01, 0x28, 0x05, 0x52, 0x08, 0x63, 0x6f,
	0x6c, 0x6c, 0x54, 0x79, 0x70, 0x65, 0x12, 0x16, 0x0a, 0x06, 0x73, 0x74, 0x61, 0x74, 0x75, 0x73,
	0x18, 0x07, 0x20, 0x01, 0x28, 0x05, 0x52, 0x06, 0x73, 0x74, 0x61, 0x74, 0x75, 0x73, 0x12, 0x1e,
	0x0a, 0x0a, 0x43, 0x72, 0x65, 0x61, 0x74, 0x65, 0x54, 0x69, 0x6d, 0x65, 0x18, 0x08, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x0a, 0x43, 0x72, 0x65, 0x61, 0x74, 0x65, 0x54, 0x69, 0x6d, 0x65, 0x12, 0x1e,
	0x0a, 0x0a, 0x4d, 0x6f, 0x64, 0x69, 0x66, 0x79, 0x54, 0x69, 0x6d, 0x65, 0x18, 0x09, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x0a, 0x4d, 0x6f, 0x64, 0x69, 0x66, 0x79, 0x54, 0x69, 0x6d, 0x65, 0x22, 0x8e,
	0x01, 0x0a, 0x0c, 0x44, 0x6f, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x52, 0x65, 0x71, 0x12,
	0x16, 0x0a, 0x06, 0x75, 0x73, 0x65, 0x72, 0x49, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x05, 0x52,
	0x06, 0x75, 0x73, 0x65, 0x72, 0x49, 0x64, 0x12, 0x16, 0x0a, 0x06, 0x69, 0x74, 0x65, 0x6d, 0x49,
	0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x05, 0x52, 0x06, 0x69, 0x74, 0x65, 0x6d, 0x49, 0x64, 0x12,
	0x1a, 0x0a, 0x08, 0x63, 0x6f, 0x6c, 0x6c, 0x54, 0x79, 0x70, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28,
	0x05, 0x52, 0x08, 0x63, 0x6f, 0x6c, 0x6c, 0x54, 0x79, 0x70, 0x65, 0x12, 0x16, 0x0a, 0x06, 0x66,
	0x6f, 0x6c, 0x64, 0x65, 0x72, 0x18, 0x04, 0x20, 0x01, 0x28, 0x05, 0x52, 0x06, 0x66, 0x6f, 0x6c,
	0x64, 0x65, 0x72, 0x12, 0x1a, 0x0a, 0x08, 0x63, 0x6f, 0x6c, 0x6c, 0x4e, 0x61, 0x6d, 0x65, 0x18,
	0x05, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x63, 0x6f, 0x6c, 0x6c, 0x4e, 0x61, 0x6d, 0x65, 0x22,
	0x0e, 0x0a, 0x0c, 0x44, 0x6f, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x52, 0x65, 0x73, 0x22,
	0x28, 0x0a, 0x0e, 0x55, 0x6e, 0x64, 0x6f, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x52, 0x65,
	0x71, 0x12, 0x16, 0x0a, 0x06, 0x63, 0x6f, 0x6c, 0x6c, 0x49, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28,
	0x05, 0x52, 0x06, 0x63, 0x6f, 0x6c, 0x6c, 0x49, 0x64, 0x22, 0x10, 0x0a, 0x0e, 0x55, 0x6e, 0x64,
	0x6f, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x52, 0x65, 0x73, 0x22, 0x5c, 0x0a, 0x0e, 0x49,
	0x73, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x65, 0x64, 0x52, 0x65, 0x71, 0x12, 0x16, 0x0a,
	0x06, 0x69, 0x74, 0x65, 0x6d, 0x49, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x05, 0x52, 0x06, 0x69,
	0x74, 0x65, 0x6d, 0x49, 0x64, 0x12, 0x1a, 0x0a, 0x08, 0x63, 0x6f, 0x6c, 0x6c, 0x54, 0x79, 0x70,
	0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x05, 0x52, 0x08, 0x63, 0x6f, 0x6c, 0x6c, 0x54, 0x79, 0x70,
	0x65, 0x12, 0x16, 0x0a, 0x06, 0x75, 0x73, 0x65, 0x72, 0x49, 0x64, 0x18, 0x03, 0x20, 0x01, 0x28,
	0x05, 0x52, 0x06, 0x75, 0x73, 0x65, 0x72, 0x49, 0x64, 0x22, 0x32, 0x0a, 0x0e, 0x49, 0x73, 0x43,
	0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x65, 0x64, 0x52, 0x65, 0x73, 0x12, 0x20, 0x0a, 0x0b, 0x69,
	0x73, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x65, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x08,
	0x52, 0x0b, 0x69, 0x73, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x65, 0x64, 0x32, 0xc7, 0x03,
	0x0a, 0x0a, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x12, 0x65, 0x0a, 0x11,
	0x47, 0x65, 0x74, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x4c, 0x69, 0x73,
	0x74, 0x12, 0x26, 0x2e, 0x63, 0x7a, 0x2e, 0x63, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f,
	0x6e, 0x2e, 0x76, 0x31, 0x2e, 0x47, 0x65, 0x74, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69,
	0x6f, 0x6e, 0x4c, 0x69, 0x73, 0x74, 0x52, 0x65, 0x71, 0x1a, 0x26, 0x2e, 0x63, 0x7a, 0x2e, 0x63,
	0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x76, 0x31, 0x2e, 0x47, 0x65, 0x74,
	0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x4c, 0x69, 0x73, 0x74, 0x52, 0x65,
	0x73, 0x22, 0x00, 0x12, 0x59, 0x0a, 0x0d, 0x47, 0x65, 0x74, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63,
	0x74, 0x69, 0x6f, 0x6e, 0x12, 0x22, 0x2e, 0x63, 0x7a, 0x2e, 0x63, 0x6f, 0x6c, 0x6c, 0x65, 0x63,
	0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x76, 0x31, 0x2e, 0x47, 0x65, 0x74, 0x43, 0x6f, 0x6c, 0x6c, 0x65,
	0x63, 0x74, 0x69, 0x6f, 0x6e, 0x52, 0x65, 0x71, 0x1a, 0x22, 0x2e, 0x63, 0x7a, 0x2e, 0x63, 0x6f,
	0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x76, 0x31, 0x2e, 0x47, 0x65, 0x74, 0x43,
	0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x52, 0x65, 0x73, 0x22, 0x00, 0x12, 0x4d,
	0x0a, 0x09, 0x44, 0x6f, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x12, 0x1e, 0x2e, 0x63, 0x7a,
	0x2e, 0x63, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x76, 0x31, 0x2e, 0x44,
	0x6f, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x52, 0x65, 0x71, 0x1a, 0x1e, 0x2e, 0x63, 0x7a,
	0x2e, 0x63, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x76, 0x31, 0x2e, 0x44,
	0x6f, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x52, 0x65, 0x73, 0x22, 0x00, 0x12, 0x53, 0x0a,
	0x0b, 0x75, 0x6e, 0x64, 0x6f, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x12, 0x20, 0x2e, 0x63,
	0x7a, 0x2e, 0x63, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x76, 0x31, 0x2e,
	0x55, 0x6e, 0x64, 0x6f, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x52, 0x65, 0x71, 0x1a, 0x20,
	0x2e, 0x63, 0x7a, 0x2e, 0x63, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x76,
	0x31, 0x2e, 0x55, 0x6e, 0x64, 0x6f, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x52, 0x65, 0x73,
	0x22, 0x00, 0x12, 0x53, 0x0a, 0x0b, 0x69, 0x73, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x65,
	0x64, 0x12, 0x20, 0x2e, 0x63, 0x7a, 0x2e, 0x63, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f,
	0x6e, 0x2e, 0x76, 0x31, 0x2e, 0x49, 0x73, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x65, 0x64,
	0x52, 0x65, 0x71, 0x1a, 0x20, 0x2e, 0x63, 0x7a, 0x2e, 0x63, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74,
	0x69, 0x6f, 0x6e, 0x2e, 0x76, 0x31, 0x2e, 0x49, 0x73, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74,
	0x65, 0x64, 0x52, 0x65, 0x73, 0x22, 0x00, 0x42, 0x4e, 0x0a, 0x14, 0x64, 0x65, 0x76, 0x2e, 0x6b,
	0x72, 0x61, 0x74, 0x6f, 0x73, 0x2e, 0x61, 0x70, 0x69, 0x2e, 0x63, 0x7a, 0x2e, 0x76, 0x31, 0x42,
	0x11, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x50, 0x72, 0x6f, 0x74, 0x6f,
	0x56, 0x31, 0x50, 0x01, 0x5a, 0x21, 0x63, 0x7a, 0x2f, 0x61, 0x70, 0x70, 0x2f, 0x73, 0x65, 0x72,
	0x76, 0x69, 0x63, 0x65, 0x2f, 0x6d, 0x61, 0x69, 0x6e, 0x2f, 0x61, 0x70, 0x69, 0x2f, 0x61, 0x70,
	0x69, 0x2f, 0x76, 0x31, 0x3b, 0x76, 0x31, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_collection_proto_rawDescOnce sync.Once
	file_collection_proto_rawDescData = file_collection_proto_rawDesc
)

func file_collection_proto_rawDescGZIP() []byte {
	file_collection_proto_rawDescOnce.Do(func() {
		file_collection_proto_rawDescData = protoimpl.X.CompressGZIP(file_collection_proto_rawDescData)
	})
	return file_collection_proto_rawDescData
}

var file_collection_proto_msgTypes = make([]protoimpl.MessageInfo, 11)
var file_collection_proto_goTypes = []interface{}{
	(*GetCollectionListReq)(nil),    // 0: cz.collection.v1.GetCollectionListReq
	(*ModelCollectionListItem)(nil), // 1: cz.collection.v1.ModelCollectionListItem
	(*GetCollectionListRes)(nil),    // 2: cz.collection.v1.GetCollectionListRes
	(*GetCollectionReq)(nil),        // 3: cz.collection.v1.GetCollectionReq
	(*GetCollectionRes)(nil),        // 4: cz.collection.v1.GetCollectionRes
	(*DoCollectReq)(nil),            // 5: cz.collection.v1.DoCollectReq
	(*DoCollectRes)(nil),            // 6: cz.collection.v1.DoCollectRes
	(*UndoCollectReq)(nil),          // 7: cz.collection.v1.UndoCollectReq
	(*UndoCollectRes)(nil),          // 8: cz.collection.v1.UndoCollectRes
	(*IsCollectedReq)(nil),          // 9: cz.collection.v1.IsCollectedReq
	(*IsCollectedRes)(nil),          // 10: cz.collection.v1.IsCollectedRes
}
var file_collection_proto_depIdxs = []int32{
	1,  // 0: cz.collection.v1.GetCollectionListRes.list:type_name -> cz.collection.v1.ModelCollectionListItem
	0,  // 1: cz.collection.v1.Collection.GetCollectionList:input_type -> cz.collection.v1.GetCollectionListReq
	3,  // 2: cz.collection.v1.Collection.GetCollection:input_type -> cz.collection.v1.GetCollectionReq
	5,  // 3: cz.collection.v1.Collection.DoCollect:input_type -> cz.collection.v1.DoCollectReq
	7,  // 4: cz.collection.v1.Collection.undoCollect:input_type -> cz.collection.v1.UndoCollectReq
	9,  // 5: cz.collection.v1.Collection.isCollected:input_type -> cz.collection.v1.IsCollectedReq
	2,  // 6: cz.collection.v1.Collection.GetCollectionList:output_type -> cz.collection.v1.GetCollectionListRes
	4,  // 7: cz.collection.v1.Collection.GetCollection:output_type -> cz.collection.v1.GetCollectionRes
	6,  // 8: cz.collection.v1.Collection.DoCollect:output_type -> cz.collection.v1.DoCollectRes
	8,  // 9: cz.collection.v1.Collection.undoCollect:output_type -> cz.collection.v1.UndoCollectRes
	10, // 10: cz.collection.v1.Collection.isCollected:output_type -> cz.collection.v1.IsCollectedRes
	6,  // [6:11] is the sub-list for method output_type
	1,  // [1:6] is the sub-list for method input_type
	1,  // [1:1] is the sub-list for extension type_name
	1,  // [1:1] is the sub-list for extension extendee
	0,  // [0:1] is the sub-list for field type_name
}

func init() { file_collection_proto_init() }
func file_collection_proto_init() {
	if File_collection_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_collection_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetCollectionListReq); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_collection_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ModelCollectionListItem); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_collection_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetCollectionListRes); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_collection_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetCollectionReq); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_collection_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetCollectionRes); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_collection_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*DoCollectReq); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_collection_proto_msgTypes[6].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*DoCollectRes); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_collection_proto_msgTypes[7].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*UndoCollectReq); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_collection_proto_msgTypes[8].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*UndoCollectRes); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_collection_proto_msgTypes[9].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*IsCollectedReq); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_collection_proto_msgTypes[10].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*IsCollectedRes); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_collection_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   11,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_collection_proto_goTypes,
		DependencyIndexes: file_collection_proto_depIdxs,
		MessageInfos:      file_collection_proto_msgTypes,
	}.Build()
	File_collection_proto = out.File
	file_collection_proto_rawDesc = nil
	file_collection_proto_goTypes = nil
	file_collection_proto_depIdxs = nil
}
