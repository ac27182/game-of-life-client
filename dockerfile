FROM    node:10.16
WORKDIR /app
COPY    . .
RUN     npm install --silent
EXPOSE  3000
CMD     npm start