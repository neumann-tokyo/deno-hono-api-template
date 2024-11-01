ARG DENO_VERSION=2.0.4
ARG BIN_IMAGE=denoland/deno:bin-${DENO_VERSION}

FROM ${BIN_IMAGE} AS deno-bin

FROM migrate/migrate AS migrate-bin

# -------------

FROM debian:bookworm

ARG USERNAME=alice

RUN apt-get update -qq && \
  apt-get install -y git locales vim less sudo postgresql-client curl && \
  useradd -r -m -s /bin/bash -d /home/$USERNAME $USERNAME && \
  echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME && \
  chmod 0440 /etc/sudoers.d/$USERNAME && \
  sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
  dpkg-reconfigure --frontend=noninteractive locales && \
  update-locale LANG=en_US.UTF-8 && \
  mkdir -p /home/$USERNAME/server && \
  mkdir -p /home/$USERNAME/deno-dir
RUN curl -fsSL https://deb.nodesource.com/setup_21.x | bash - && \
  apt-get update -qq && apt-get install -y nodejs && \
  npm install -g @biomejs/biome sql-formatter

ENV LANGUAGE en_US.UTF-8
ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ENV DENO_DIR /home/$USERNAME/deno-dir
ENV DENO_INSTALL_ROOT /usr/local

ARG DENO_VERSION
ENV DENO_VERSION=${DENO_VERSION}
COPY --from=deno-bin /deno /usr/bin/deno

COPY --from=migrate-bin /usr/local/bin/migrate /usr/bin/migrate

USER $USERNAME
WORKDIR /home/$USERNAME/server
COPY . /home/$USERNAME/server
RUN cat /home/$USERNAME/server/.devcontainer/.bashrc > /home/$USERNAME/.bashrc

CMD ["bash"]
