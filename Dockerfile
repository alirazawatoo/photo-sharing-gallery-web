FROM node:22-bookworm-slim

WORKDIR /app
RUN chown node:node /app
USER node

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --no-audit --no-fund && npm cache clean --force

COPY --chown=node:node . .

# The dev server must listen on all interfaces to be reachable from the host.
ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["npm", "start"]
