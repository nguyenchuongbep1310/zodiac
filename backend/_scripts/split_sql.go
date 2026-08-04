package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	file, err := os.Open("seed_complete_production.sql")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	// Set 10MB buffer size to handle long lines
	buf := make([]byte, 10*1024*1024)
	scanner.Buffer(buf, 10*1024*1024)

	partNum := 1
	lineCount := 0
	linesPerPart := 500

	partFile, _ := os.Create(fmt.Sprintf("seed_part%d.sql", partNum))

	for scanner.Scan() {
		line := scanner.Text()
		partFile.WriteString(line + "\n")
		lineCount++

		if lineCount >= linesPerPart {
			partFile.Close()
			partNum++
			lineCount = 0
			partFile, _ = os.Create(fmt.Sprintf("seed_part%d.sql", partNum))
		}
	}
	partFile.Close()
	fmt.Println("Split completed successfully into smaller parts!")
}
