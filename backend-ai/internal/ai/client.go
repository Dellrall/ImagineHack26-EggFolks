package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

type Client struct {
	BaseURL    string
	HTTPClient *http.Client
}

func New(baseURL string) *Client {
	return &Client{
		BaseURL: strings.TrimRight(baseURL, "/"),
		HTTPClient: &http.Client{
			Timeout: 15 * time.Second,
		},
	}
}

func (c *Client) RecommendRoute(ctx context.Context, request any) (map[string]any, error) {
	var response map[string]any
	if err := c.doJSON(ctx, http.MethodPost, "/ai/route", request, &response); err != nil {
		return nil, err
	}

	return response, nil
}

func (c *Client) doJSON(ctx context.Context, method, path string, request any, response any) error {
	if c.BaseURL == "" {
		return fmt.Errorf("AI service URL is empty")
	}

	body, err := json.Marshal(request)
	if err != nil {
		return fmt.Errorf("marshal request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, method, c.BaseURL+path, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("build request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("call AI service: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		payload, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("AI service returned %s: %s", resp.Status, strings.TrimSpace(string(payload)))
	}

	if err := json.NewDecoder(resp.Body).Decode(response); err != nil {
		return fmt.Errorf("decode AI response: %w", err)
	}

	return nil
}
