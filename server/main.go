package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
)

func main() {
	fmt.Print("Hello World")

	app := fiber.New()

	app.Get("/convert", func(c *fiber.Ctx) error {
        return c.SendString("Hello, World!")
    })

	log.Fatal(app.Listen(":8000"))
}