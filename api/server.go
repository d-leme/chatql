package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/d-leme/chatql/graph"
	"github.com/d-leme/chatql/graph/model"
	"github.com/gorilla/websocket"
	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/cors"
	"github.com/vektah/gqlparser/v2/ast"
)

const defaultPort = "8080"

type Message struct {
	ID        string
	Content   string
	CreatedAt time.Time
}

type Channel struct {
	ID   string
	Name string
}

func main() {
	db, err := setupDatabase()
	if err != nil {
		log.Fatalf("failed to set up database: %v", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Upgrade", "Connection"},
		AllowCredentials: true,
	})

	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{
		DB:            db,
		Subscriptions: make(map[string]map[string]chan *model.Message),
	}}))

	srv.AddTransport(&transport.Websocket{
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	})
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", c.Handler(srv))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func setupDatabase() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./messages.db")
	if err != nil {
		return nil, err
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS channels (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL
	)`)
	if err != nil {
		return nil, err
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS messages (
		id TEXT PRIMARY KEY,
		content TEXT NOT NULL,
		owner TEXT NOT NULL,
		created_at DATETIME NOT NULL,
		channel_id TEXT NOT NULL,
		FOREIGN KEY(channel_id) REFERENCES channels(id)
	)`)
	if err != nil {
		return nil, err
	}

	return db, nil
}
