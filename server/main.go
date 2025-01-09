package main

import (
	"fmt"
	"os"
	"strconv"

	"log"

	"github.com/1deyce/currex/converter"
	"github.com/1deyce/currex/rates"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

type CurrencyData struct {
	From   	string `json:"from"`
	To 		string `json:"to"`
	Amount 	string `json:"amount"`
}

type ConversionResponse struct {
	ConvertedAmount float64 `json:"amount"`
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders:  "Origin, Content-Type, Accept",
		AllowMethods: "POST, GET, OPTIONS",
	}))

	app.Post("/convert", func(c *fiber.Ctx) error {
		var data CurrencyData

		if err := c.BodyParser(&data); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}

		from := data.From
		to := data.To
		amountStr := data.Amount

		log.Printf(from, to, amountStr)

		appID := os.Getenv("OPENEXCHANGE_APP_ID")
		if appID == "" {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "OPENEXCHANGE_APP_ID not set"})
		}

		apiURL := fmt.Sprintf("https://openexchangerates.org/api/latest.json?app_id=%s&symbols=USD,GBP,EUR,JPY,ZAR", appID)
		rates, err := rates.FetchRates(apiURL)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": fmt.Sprintf("Error fetching exchange rates: %v", err)})
		}

		amount, err := strconv.ParseFloat(amountStr, 64)
		if err != nil {
			fmt.Printf("Error parsing amount: %v\n", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": fmt.Sprintf("Error parsing amount: %v", err)})
		}

		converted, err := converter.Convert(from, to, amount, rates)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": fmt.Sprintf("Error converting currency: %v", err)})
		}

		response := ConversionResponse{
			ConvertedAmount: converted,
		}

		return c.Status(fiber.StatusOK).JSON(response)
    })

	log.Fatal(app.Listen(":8000"))
}