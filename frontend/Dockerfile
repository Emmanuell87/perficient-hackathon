# ---------- Stage 1: build ----------
FROM node:24.11.1-alpine AS builder

WORKDIR /app

# 1) Instalar dependencias del frontend
COPY package*.json ./
RUN npm install

# 2) Variables de entorno para el build de Vite
# Railway inyecta las variables como build-args automáticamente si las declaras con ARG
# (VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, etc.)
ARG VITE_API_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Las exponemos como envs para que Vite las lea en npm run build:docker
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

# 3) Copiar el código fuente del frontend
COPY . .

# 4) Construir la app estática (vite build)
RUN npm run build:docker


# ---------- Stage 2: runtime (servidor estático con nginx) ----------
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# 5) Copiar el build generado al directorio público de nginx
COPY --from=builder /app/dist ./

# 6) Puerto donde escucha nginx dentro del contenedor
EXPOSE 80

# 7) Comando de arranque
CMD ["nginx", "-g", "daemon off;"]
