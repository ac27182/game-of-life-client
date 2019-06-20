FROM        node:alpine AS stage1
WORKDIR     /app
COPY        . .
RUN         npm install && npm run build

FROM        node:alpine AS prod
COPY        --from=stage1 /app/build /build
RUN         npm install -g serve
EXPOSE      3000
ENTRYPOINT  serve build -l 3000