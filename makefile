up:
	@docker-compose up

build-all: build-server build-client

build-server:
	@docker build -t game-of-life-server ../game-of-life-server

build-client:
	@docker build -t game-of-life-client .

run-client:
	@docker run -it -p 3000:3000 game-of-life-client	

