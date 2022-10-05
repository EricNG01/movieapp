FROM node:14 AS client-build

WORKDIR /movie_search
COPY ./client ./client

WORKDIR /movie_search/client

ENV REACT_APP_PORT 3000
ENV REACT_APP_ADDRESS 3.104.74.239


RUN npm run build

FROM node:14 AS server-build

WORKDIR /movie_search
COPY --from=client-build /movie_search/client/build ./client/build

WORKDIR /movie_search/server
COPY ./server ./

ENV AWS_ACCESS_KEY_ID "XX"
ENV AWS_SECRET_ACCESS_KEY "YY"
ENV AWS_SESSION_TOKEN "ZZ"
ENV TMDB_APIKEY 'c10df7e1d48fda8afc1aba585e977ca7'
ENV YOUTUBE_APIKEY 'AIzaSyCNAZlB3nY11rpXkxXuqSBMVMXxHeLSqjk'
ENV MOVIEREVIEW_APIKEY 'SncS9JjpoBGhz9k0ibWZcS4OPnr0eEaL'
ENV AWS_REGION "ap-southeast-2"

ENV ADDRESS 3.104.74.239
ENV PORT 8080

EXPOSE 8080

CMD node ./index.js


