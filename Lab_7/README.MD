how to use the project ?

unzip the code to a folder
in the root run the following

npm i
npm run client:install
npm run dev

for server only
npm run server

for client only
npm run client

to seed
npm run seed

make sure redis is running as well !

sudo service redis-server start

redis-cli
PING input should give back pong

FLUSHALL
