FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=8080
COPY . .
RUN mkdir -p backend/data && chown -R node:node /app
USER node
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/api/health || exit 1
CMD ["node", "docker/entry.cjs"]
