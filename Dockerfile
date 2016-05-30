FROM mhart/alpine-node:6.2

ENV InstallationDir=/usr/share/nginx/html/applogin

WORKDIR ${InstallationDir}

RUN mkdir -p ${InstallationDir}

COPY . ${InstallationDir}

RUN echo -e '#!/bin/ash\n ash "$@"' > /bin/bash && chmod +x /bin/bash && \
    apk update && \
    apk add ruby-dev python libffi-dev \
            make autoconf automake gcc g++ bzip2 git ruby && \
    npm install -g nan iconv node-gyp coffee-script grunt grunt-cli i18next-conv bower \
    && gem update --no-document --system \
    && gem install --no-document json_pure compass \
    && gem cleanup \
    && gem sources -c && \
    ./build.sh && \
    npm -g uninstall nan iconv node-gyp coffee-script grunt grunt-cli i18next-conv bower && \
    npm -g cache clean && \
    npm cache clean && \
    rm -rf /usr/lib/ruby && \
    rm -rf /root/.node-gyp && \
    rm -rf /root/.cache && \
    apk del ruby-dev python libffi-dev make autoconf automake gcc g++ bzip2 git ruby && \
    rm -r /etc/ssl /var/cache/apk/*

VOLUME ${InstallationDir}

CMD ${InstallationDir}/start.sh
