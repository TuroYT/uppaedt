# auto deploy sur coolify


FROM node:18-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./


RUN npm install
COPY . .


RUN npm run build


FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]