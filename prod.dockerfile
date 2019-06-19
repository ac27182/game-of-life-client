FROM    node:latest
WORKDIR /app
COPY    . .
RUN     npm install && npm install -g serve && npm run build
CMD     serve -s build -l 3000