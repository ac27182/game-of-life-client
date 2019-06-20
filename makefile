IMAGE_NAME := game-of-life-client-production

up:
	@docker-compose up

build-all: build-server build-client

build-server:
	@docker build -t game-of-life-server ../game-of-life-server

build-client:
	@docker build -t game-of-life-client .

run-client:
	@docker run -it -p 3000:3000 game-of-life-client	

heroku-deploy:
	git push heroku master
	# docker tag test-client registry.heroku.com/game-of-life-client/web &&\
	# docker push registry.heroku.com/game-of-life-client/web

build-prod:
	docker build -t test-client -f prod.dockerfile .

