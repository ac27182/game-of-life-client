# game of life client

## description

this repository contains the prototype client for a multiplayer verison of conways game of life, future work and optimisations will by performed in `ac27182/game-of-life-client-v2`. the purpose of this project is to gain a better understanding of concurrency in go, and to experiment with websockets.

## local setup

---

### prerequisites

- go 1.12
- nodejs 10.x
- docker-compose
- docker
- gnu make

### instructions

1.  clone [game-of-life-client](https://github.com/ac27182/game-of-life-client) and [game-of-life-server](https://github.com/ac27182/game-of-life-server) into your go path
    eg:

```
/go/usr/github.com/USER
                        /game-of-life-client
                        /game-of-life-server
```

2.  open the `game-of-life-client` directory

```sh
$ cd game-of-life-client
```

3. run the below make command to build the docker containers

```sh
$ make build-all
```

4. run the below make command to bring up the containers.

```sh
$ make up
```

5. now, the client should be running on `localhost:3000` and the server should be running on `localhost:3001`

6. to test the functionality of the game open one session in your normal browser, and another in incognitio mode to simulate two sessions interacting with eachother.

---

# notes

## improvements

- optimize client and server
- write more unit tests for client and server
- simplify message exchange over the websocket
- improve the UI/UX
- move local make commands to cirlcci pipelines for deployments
- create terraform file to provision aws infrastructure
