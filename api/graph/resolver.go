package graph

import (
	"database/sql"
	"sync"

	"github.com/d-leme/chatql/graph/model"
	_ "github.com/mattn/go-sqlite3"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	DB            *sql.DB
	MU            sync.Mutex
	Subscriptions map[string]map[string]chan *model.Message
}
