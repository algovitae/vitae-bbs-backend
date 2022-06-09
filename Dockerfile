FROM public.ecr.aws/lambda/nodejs:16

RUN npm install -g yarn

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build

CMD ["dist/src/handler.handler"]
