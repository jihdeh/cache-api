FROM node:14

# Create app directory
ADD . /usr/src/fashion-cloud
WORKDIR /usr/src/fashion-cloud

# Install app dependencies
RUN yarn