APP_NAME=chatql
DB_FILE=chatql.db

.PHONY: all run clean deps build

all: build

build:
	GOOS=linux GOARCH=amd64 go build -o $(APP_NAME)

run:
	go run server.go

test:
	go test ./...

gql-init:
	go run github.com/99designs/gqlgen init
	
gql-gen:
	go run github.com/99designs/gqlgen generate
