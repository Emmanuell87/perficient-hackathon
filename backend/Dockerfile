# ---------- Stage 1: build ----------
FROM node:24.11.1-alpine AS builder
# si hubiera problema con esta etiqueta, puedes usar: node:24-alpine

WORKDIR /app

# Copiamos package.json / package-lock.json
COPY package*.json ./

# Instalar dependencias de desarrollo
RUN npm install
# o si usas package-lock.json consistente:
# RUN npm ci

# Copiar tsconfig y el código fuente
COPY tsconfig.json ./
COPY src ./src

# Compilar TypeScript -> dist/
RUN npm run build


# ---------- Stage 2: runtime ----------
FROM node:24.11.1-alpine

WORKDIR /app
ENV NODE_ENV=production

# Solo dependencias necesarias en producción
COPY package*.json ./
RUN npm install --omit=dev
# o npm ci --omit=dev si tienes package-lock

# Copiar el build
COPY --from=builder /app/dist ./dist

# Puerto interno del contenedor
EXPOSE 3000

# Asegúrate que en src/server.ts uses process.env.PORT || 3000
CMD ["node", "dist/server.js"]
