FROM --platform=linux/amd64 node:20.9.0-slim AS build

ARG TS_CONFIG_PATH 

WORKDIR /app

# Copy tsconfig.json from the build context root
COPY ${TS_CONFIG_PATH} ./tsconfig.json

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Use a smaller base image for the runtime
FROM --platform=linux/amd64 node:20.9.0-slim

WORKDIR /app

# Copy only the built files and node_modules from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

EXPOSE 3030

CMD ["node", "dist/api/index.js"]