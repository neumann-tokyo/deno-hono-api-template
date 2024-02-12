ARG DENO_VERSION=1.40.4
ARG BIN_IMAGE=denoland/deno:bin-${DENO_VERSION}

FROM ${BIN_IMAGE} AS bin

# -------------

FROM debian:bookworm

ARG USERNAME=alice

RUN apt-get update -qq && \
  apt-get install -y git locales tzdata vim less sudo postgresql-client && \
  useradd -r -m -s /bin/bash -d /home/$USERNAME -u 998 $USERNAME && \
  echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME && \
  chmod 0440 /etc/sudoers.d/$USERNAME && \
  sed -i -e 's/# ja_JP.UTF-8 UTF-8/ja_JP.UTF-8 UTF-8/' /etc/locale.gen && \
  dpkg-reconfigure --frontend=noninteractive locales && \
  update-locale LANG=ja_JP.UTF-8 && \
  ln -fs /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
  dpkg-reconfigure -f noninteractive tzdata && \
  mkdir -p /home/$USERNAME/server && \
  mkdir -p /home/$USERNAME/deno-dir && \
  chown -R $USERNAME:$USERNAME /home/$USERNAME/server && \
  chown -R $USERNAME:$USERNAME /home/$USERNAME/deno-dir

ENV LANGUAGE ja_JP.UTF-8
ENV LC_ALL ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
ENV DENO_DIR /home/$USERNAME/deno-dir
ENV DENO_INSTALL_ROOT /usr/local

ARG DENO_VERSION
ENV DENO_VERSION=${DENO_VERSION}
COPY --from=bin /deno /usr/bin/deno

USER $USERNAME
WORKDIR /home/$USERNAME/server
COPY . /home/$USERNAME/server
RUN cat /home/$USERNAME/server/.devcontainer/.bashrc > /home/$USERNAME/.bashrc

CMD ["bash"]
