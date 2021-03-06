// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.26.0
// 	protoc        v3.15.8
// source: collection.proto

package errors

import (
	_ "github.com/go-kratos/kratos/v2/api/kratos/api"
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

type Collection int32

const (
	Collection_InternalError      Collection = 0
	Collection_CollectionNotExist Collection = 1
	Collection_Collected          Collection = 2
)

// Enum value maps for Collection.
var (
	Collection_name = map[int32]string{
		0: "InternalError",
		1: "CollectionNotExist",
		2: "Collected",
	}
	Collection_value = map[string]int32{
		"InternalError":      0,
		"CollectionNotExist": 1,
		"Collected":          2,
	}
)

func (x Collection) Enum() *Collection {
	p := new(Collection)
	*p = x
	return p
}

func (x Collection) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (Collection) Descriptor() protoreflect.EnumDescriptor {
	return file_collection_proto_enumTypes[0].Descriptor()
}

func (Collection) Type() protoreflect.EnumType {
	return &file_collection_proto_enumTypes[0]
}

func (x Collection) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use Collection.Descriptor instead.
func (Collection) EnumDescriptor() ([]byte, []int) {
	return file_collection_proto_rawDescGZIP(), []int{0}
}

var File_collection_proto protoreflect.FileDescriptor

var file_collection_proto_rawDesc = []byte{
	0x0a, 0x10, 0x63, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x12, 0x14, 0x63, 0x7a, 0x2e, 0x63, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f,
	0x6e, 0x2e, 0x65, 0x72, 0x72, 0x6f, 0x72, 0x73, 0x1a, 0x1c, 0x6b, 0x72, 0x61, 0x74, 0x6f, 0x73,
	0x2f, 0x61, 0x70, 0x69, 0x2f, 0x61, 0x6e, 0x6e, 0x6f, 0x74, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x73,
	0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x2a, 0x4b, 0x0a, 0x0a, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63,
	0x74, 0x69, 0x6f, 0x6e, 0x12, 0x11, 0x0a, 0x0d, 0x49, 0x6e, 0x74, 0x65, 0x72, 0x6e, 0x61, 0x6c,
	0x45, 0x72, 0x72, 0x6f, 0x72, 0x10, 0x00, 0x12, 0x16, 0x0a, 0x12, 0x43, 0x6f, 0x6c, 0x6c, 0x65,
	0x63, 0x74, 0x69, 0x6f, 0x6e, 0x4e, 0x6f, 0x74, 0x45, 0x78, 0x69, 0x73, 0x74, 0x10, 0x01, 0x12,
	0x0d, 0x0a, 0x09, 0x43, 0x6f, 0x6c, 0x6c, 0x65, 0x63, 0x74, 0x65, 0x64, 0x10, 0x02, 0x1a, 0x03,
	0xa0, 0x45, 0x01, 0x42, 0x56, 0x0a, 0x14, 0x64, 0x65, 0x76, 0x2e, 0x6b, 0x72, 0x61, 0x74, 0x6f,
	0x73, 0x2e, 0x61, 0x70, 0x69, 0x2e, 0x63, 0x7a, 0x2e, 0x76, 0x31, 0x42, 0x11, 0x43, 0x6f, 0x6c,
	0x6c, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x50, 0x72, 0x6f, 0x74, 0x6f, 0x56, 0x31, 0x50, 0x01,
	0x5a, 0x29, 0x63, 0x7a, 0x2f, 0x61, 0x70, 0x70, 0x2f, 0x73, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65,
	0x2f, 0x6d, 0x61, 0x69, 0x6e, 0x2f, 0x61, 0x70, 0x69, 0x2f, 0x61, 0x70, 0x69, 0x2f, 0x65, 0x72,
	0x72, 0x6f, 0x72, 0x73, 0x3b, 0x65, 0x72, 0x72, 0x6f, 0x72, 0x73, 0x62, 0x06, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x33,
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

var file_collection_proto_enumTypes = make([]protoimpl.EnumInfo, 1)
var file_collection_proto_goTypes = []interface{}{
	(Collection)(0), // 0: cz.collection.errors.Collection
}
var file_collection_proto_depIdxs = []int32{
	0, // [0:0] is the sub-list for method output_type
	0, // [0:0] is the sub-list for method input_type
	0, // [0:0] is the sub-list for extension type_name
	0, // [0:0] is the sub-list for extension extendee
	0, // [0:0] is the sub-list for field type_name
}

func init() { file_collection_proto_init() }
func file_collection_proto_init() {
	if File_collection_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_collection_proto_rawDesc,
			NumEnums:      1,
			NumMessages:   0,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_collection_proto_goTypes,
		DependencyIndexes: file_collection_proto_depIdxs,
		EnumInfos:         file_collection_proto_enumTypes,
	}.Build()
	File_collection_proto = out.File
	file_collection_proto_rawDesc = nil
	file_collection_proto_goTypes = nil
	file_collection_proto_depIdxs = nil
}
