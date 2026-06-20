package stats

type CarbonSummary struct {
	KgCO2Saved    float64 `json:"kg_co2_saved"`
	TardinessRate float64 `json:"tardiness_rate"`
	Satisfaction  float64 `json:"satisfaction_score"`
}

type Calculator struct{}

func NewCalculator() *Calculator {
	return &Calculator{}
}

func (c *Calculator) EmptySummary() CarbonSummary {
	return CarbonSummary{}
}
