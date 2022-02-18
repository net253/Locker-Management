FROM node:14
RUN mkdir /snc-locker
WORKDIR /snc-locker
COPY . /snc-locker
RUN npm install
COPY . .
EXPOSE 8090
CMD [ "npm", "start" ]