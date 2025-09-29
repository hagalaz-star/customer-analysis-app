.PHONY: up down logs build test test-local

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f --tail=200

build:
	docker compose build

test:
	docker compose run --rm api pytest -q

test-local:
	cd backend && pytest -q

