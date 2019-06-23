CLIENT := game-of-life-client
SERVER := game-of-life-server

up:
	@docker-compose up

build-all: build-server build-client

build-server:
	@docker build -t $(SERVER) ../$(SERVER)

build-client:
	@docker build -t $(CLIENT) .

run-client:
	@docker run -it $(CLIENT)	

remove-containers:
	@docker rm -f `docker ps -aq`

remove-images:
	@docker rmi -f `docker images -q`

check:
	@docker images | grep "game-of-life"