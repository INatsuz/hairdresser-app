FROM node:23-alpine as admin-panel-builder

WORKDIR /opt/hairdresser-admin-panel
COPY hairdresser-admin-panel .

RUN npm install && npm run build

FROM node:23-alpine

WORKDIR /opt/hairdresser-backend
COPY hairdresser-backend .
COPY --from=admin-panel-builder /opt/hairdresser-admin-panel/dist/ ./public

RUN npm install

EXPOSE 443 80

CMD ["npm", "run", "start"]
