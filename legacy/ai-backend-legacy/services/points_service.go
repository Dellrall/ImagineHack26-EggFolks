package services

import "eco-route/models"

type PointsService struct {
	aiClient *AIClient
}

func NewPointsService(aiClient *AIClient) *PointsService {
	return &PointsService{
		aiClient: aiClient,
	}
}

func (s *PointsService) GetMyPoints() (models.PointsSummary, error) {
	return s.aiClient.GetPointsSummary()
}
