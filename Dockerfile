ARG FUNCTION_DIR="/var/task"

FROM node:20-bookworm

ARG FUNCTION_DIR

RUN apt-get update && \
    apt-get install -y \
    g++ \
    make \
    cmake \
    unzip \
    libcurl4-openssl-dev

RUN mkdir -p ${FUNCTION_DIR}
WORKDIR ${FUNCTION_DIR}

ENV NPM_CONFIG_CACHE=/tmp/.npm
ENV PLAYWRIGHT_TMP_DIR=/tmp/
ENV PLAYWRIGHT_BROWSERS_PATH=/var/task/ms-playwright

COPY package*.json src/index.ts ./

RUN npm install
RUN npm install aws-lambda-ric
RUN npx -y playwright@1.47.2 install chromium --with-deps
RUN npm run build

ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]

CMD ["dist/index.handler"]