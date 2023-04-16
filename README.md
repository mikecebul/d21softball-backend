# District 21 Softball of Michigan

E-commerce website to sell registration for tournaments and training workshops. Plus lots of pages for history and information.
https://d21softball.org/

## How to use

```bash
nvm use 14
```

```bash
yarn
```

```bash
yarn build
```

If in production and low on memory to build use:

```bash
NODE_ENV=production yarn build --no-optimization
```

```bash
yarn db:up
```

The first time you will want to seed the database. If you don't have a pg_dump from production, you need to get a fresh copy. Remote into production and switch to the postgres user.

```bash
sudo su - postgres
```
Then pg_dump a copy. These flags inculde blobs, clean, and verbose.

```bash
pg_dump -bcv > d21.sql
```

Now restore the newly created docker DB with the dump.
```bash
docker exec -i postgres-d21-v3 psql -U strapi strapi-v3 < d21.sql
```

```bash
yarn dev
```

### Infrastructure

Strapi CMS on Digital Ocean Droplet.

### Frontend

This website was created with Nextjs and Material UI. <br>
https://github.com/mikecebul/d21softball-frontend

## Inspiration

I followed this project by GallowDaSballow
https://github.com/GalloDaSballo/Next-Ecommerce-Frontend <br>
Lot's of great tutorials for Material UI, but I have to say the most helpful was from Anthony Sistilli <br>
https://youtube.com/playlist?list=PLQg6GaokU5CwiVmsZ0d_9Zsg_DnIP_xwr
