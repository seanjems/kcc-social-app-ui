# Stage 1: Build the React app
FROM node:18 AS build
WORKDIR /usr/src/app

# Copy only package files for dependency installation
COPY package*.json ./

# Install Yarn globally if not already installed
RUN yarn --version || npm install -g yarn

# Install dependencies using Yarn and leverage frozen lockfile
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the React application
RUN yarn build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf  
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
