# https://developers.home-assistant.io/docs/apps/dockerfile
ARG BUILD_FROM=ghcr.io/home-assistant/base:3.23
FROM ${BUILD_FROM}

# Node.js runs the app (no npm packages needed); tzdata for local times.
RUN apk add --no-cache nodejs tzdata

COPY rootfs /
RUN chmod a+x /etc/services.d/memoria/run /etc/services.d/memoria/finish

LABEL \
    org.opencontainers.image.title="Home Assistant App: MemorIA" \
    org.opencontainers.image.description="Blocos de anotações em forma de caderno, por período e horário do dia." \
    org.opencontainers.image.source="https://github.com/diegozapella63/memoria-ha" \
    org.opencontainers.image.licenses="MIT"
