FROM node:12.16.3-slim
#ENV npm_config_platform=linux
WORKDIR /usr/src/xd_back_end
COPY . .
RUN npm install && rm -rf node_modules/sharp && npm install && npm rebuild
# npm install -g cnpm --registry=https://registry.npm.taobao.org &&
EXPOSE 6001

ENV NODE_ENV devlopement
# 中文乱码
ENV LANG=zh_CN.UTF8
ENV LC_ALL=zh_CN.UTF8

#ENTRYPOINT cnpm install
CMD npm run dev

