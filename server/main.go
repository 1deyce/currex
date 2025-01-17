package main

import (
	"bufio"
	"fmt"
	"strconv"
	"time"

	"log"

	"github.com/1deyce/currex/converter"
	"github.com/1deyce/currex/rates"
	"github.com/1deyce/currex/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/valyala/fasthttp"
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

		apiURL := "https://open.er-api.com/v6/latest/USD"
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

	app.Get("/sse", func(c *fiber.Ctx) error {
		c.Set("Content-Type", "text/event-stream")
		c.Set("Cache-Control", "no-cache")
		c.Set("Connection", "keep-alive")
	
		c.Status(fiber.StatusOK)

		writer := fasthttp.StreamWriter(func(w *bufio.Writer) {
			for {
				apiUrl := "https://open.er-api.com/v6/latest/USD"
		
				rates, err := rates.FetchRates(apiUrl)
				if err != nil {
					log.Printf("Error fetching exchange rates: %v", err) 
					break 
				}
		
				message := utils.FormatRates(rates.Rates)
				_, err = w.WriteString("data: " + message + "\n\n")
				if err != nil {
					log.Printf("Error writing data: %v", err) 
					break 
				}
		
				_, err = w.WriteString(": heartbeat\n\n")
				if err != nil {
					log.Printf("Error writing heartbeat: %v", err)
					break 
				}

				err = w.Flush()
				if err != nil {
					fmt.Printf("Error while flushing: %v. Closing http connection.\n", err)
					break
				}
		
				time.Sleep(5 * time.Second)
			}
		})
		
		c.Context().SetBodyStreamWriter(writer)
		
		return nil
	})

	log.Fatal(app.Listen(":8000"))
}