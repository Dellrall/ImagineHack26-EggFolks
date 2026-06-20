package services

import (
	"net/http"
	"os"
	"strings"
	"time"

	"eco-route/models"
)

const (
	aiRoutePath    = "/ai/route"
	aiFeedbackPath = "/ai/feedback"
	aiPointsPath   = "/ai/points"
)

type AIClient struct {
	baseURL    string
	httpClient *http.Client
}

func NewAIClient() *AIClient {
	return &AIClient{
		baseURL: strings.TrimRight(os.Getenv("AI_SERVICE_URL"), "/"),
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (c *AIClient) RouteEndpoint() string {
	return c.endpoint(aiRoutePath)
}

func (c *AIClient) FeedbackEndpoint() string {
	return c.endpoint(aiFeedbackPath)
}

func (c *AIClient) PointsEndpoint() string {
	return c.endpoint(aiPointsPath)
}

func (c *AIClient) GetRouteRecommendation() (models.RouteRecommendation, error) {
	return models.RouteRecommendation{
		RecommendedRoute: "MRT Kajang Line",
		TravelTime:       35,
		CarbonSaved:      3.4,
		EcoPoints:        10,
	}, nil
}

func (c *AIClient) SubmitFeedback(feedback models.Feedback) error {
	_ = feedback
	return nil
}

func (c *AIClient) GetPointsSummary() (models.PointsSummary, error) {
	return models.PointsSummary{
		Points: 250,
		Rank:   8,
		History: []models.PointsHistoryItem{
			{
				Reason: "Used MRT",
				Points: 10,
			},
		},
	}, nil
}

func (c *AIClient) endpoint(path string) string {
	if c.baseURL == "" {
		return path
	}

	return c.baseURL + path
}
