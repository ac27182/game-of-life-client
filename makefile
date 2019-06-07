build:
	@docker build -t game-of-life-client .

run-dev:
	@docker run -it -p 3000:3000 game-of-life-client