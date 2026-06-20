package models

type PointsHistoryItem struct {
	Reason string `json:"reason"`
	Points int    `json:"points"`
}

type PointsSummary struct {
	Points  int                 `json:"points"`
	Rank    int                 `json:"rank"`
	History []PointsHistoryItem `json:"history"`
}
