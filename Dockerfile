FROM node:14-alpine AS BUILD_IMAGE

WORKDIR /strapi

# Resolve node_modules for caching
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install --production=true --frozen-lockfile

# Copy all for build and release cache if package.json update
COPY . .

# Create .env.production from Docker secrets (build-time only)
RUN --mount=type=secret,id=STRIPE_SK \
  --mount=type=secret,id=ADMIN_JWT_SECRET \
  --mount=type=secret,id=JWT_SECRET \
  sh -c '( \
  echo "STRIPE_SK=$(cat /run/secrets/STRIPE_SK)" && \
  echo "ADMIN_JWT_SECRET=$(cat /run/secrets/ADMIN_JWT_SECRET)" && \
  echo "JWT_SECRET=$(cat /run/secrets/JWT_SECRET)" \
  ) > .env.production'

ENV NODE_ENV=production

RUN yarn build

#------------------------------------------------------------------------------------

# Create new namespace for final Docker Image
FROM node:14-alpine

# Only copy your source code without system file
COPY --from=BUILD_IMAGE /strapi /strapi

WORKDIR /strapi

EXPOSE 1337

ENV NODE_ENV=production
ENV STRAPI_LOG_LEVEL=debug

CMD ["yarn", "start"]