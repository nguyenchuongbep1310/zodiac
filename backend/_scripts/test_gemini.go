package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"google.golang.org/genai"
)

func main() {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		log.Fatal("GEMINI_API_KEY environment variable is required")
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		Backend: genai.BackendGeminiAPI,
		APIKey:  apiKey,
	})
	if err != nil {
		log.Fatalf("Error creating client: %v", err)
	}

	resp, err := client.Models.GenerateContent(ctx, "gemini-flash-latest", genai.Text("Say hello"), nil)
	if err != nil {
		log.Fatalf("Error generating content: %v", err)
	}
	
	for _, cand := range resp.Candidates {
		for _, part := range cand.Content.Parts {
			fmt.Println(part.Text)
		}
	}
}
