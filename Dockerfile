# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install --frozen-lockfile && npm run build

# --- Production Stage ---
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/static ./static
COPY --from=builder /app/.svelte-kit ./.svelte-kit

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "build"] 