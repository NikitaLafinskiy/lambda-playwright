FROM mcr.microsoft.com/playwright:v1.46.0-noble as playwright

FROM public.ecr.aws/lambda/nodejs:20

WORKDIR ${LAMBDA_TASK_ROOT}
COPY package*.json src/index.ts  ./
RUN npm install
RUN npm run build

ENV PLAYWRIGHT_BROWSERS_PATH=/var/task/playwright
RUN mkdir -p /var/task/playwright/chromium-1129/
COPY --from=playwright /ms-playwright/chromium-1129/* /var/task/playwright/chromium-1129/

CMD ["dist/index.handler"]

# /ms-playwright/chromium-1129/chrome-linux/chrome
# /tmp/ms-playwright/chromium-1129/chrome-linux/chrome