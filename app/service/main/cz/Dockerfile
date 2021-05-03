FROM node:12.16.3-slim

WORKDIR /usr/src/xd_back_end
COPY . .
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org && cnpm install

EXPOSE 6001

ENV NODE_ENV devlopement
# 中文乱码
ENV LANG=zh_CN.UTF8
ENV LC_ALL=zh_CN.UTF8

CMD npm run dev

