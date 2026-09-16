.PHONY: up down offline-bundle

up:
	docker compose up --build

down:
	docker compose down

offline-bundle:
	@echo "Offline packaging script will be added under scripts/"
