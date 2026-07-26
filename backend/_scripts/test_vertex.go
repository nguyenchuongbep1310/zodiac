package main

import (
	"context"
	"fmt"
	"log"

	"google.golang.org/genai"
)

func main() {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		Backend:  genai.BackendVertexAI,
		Project:  "gen-lang-client-0214793257",
		Location: "us-central1",
	})
	if err != nil {
		log.Fatalf("Error creating client: %v", err)
	}

	resp, err := client.Models.GenerateContent(ctx, "gemini-1.5-flash", genai.Text("Hello, world!"), nil)
	if err != nil {
		log.Fatalf("Error generating content: %v", err)
	}

	for _, cand := range resp.Candidates {
		for _, part := range cand.Content.Parts {
			fmt.Println(part.Text)
		}
	}
}
