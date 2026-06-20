package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	Pool *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *Repository {
	return &Repository{Pool: pool}
}

func (r *Repository) Ping(ctx context.Context) error {
	return r.Pool.Ping(ctx)
}
