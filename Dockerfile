FROM node:20 AS backend-build
WORKDIR backend/
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build


FROM node:20 AS frontend-build
WORKDIR frontend/
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build


FROM nginx:stable-alpine
COPY --from=backend-build /app/backend/dist /usr/share/nginx/html/api
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 8082
CMD ["nginx", "-g", "daemon off;"]