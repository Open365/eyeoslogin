FROM mhart/alpine-node:6.2

ENV InstallationDir=/usr/share/nginx/html/applogin

WORKDIR ${InstallationDir}

RUN mkdir -p ${InstallationDir}

COPY . ${InstallationDir}

RUN echo -e '#!/bin/ash\n ash "$@"' > /bin/bash && chmod +x /bin/bash && \
    apk update && \
    apk add ruby-dev python libffi-dev \
            make autoconf automake gcc g++ bzip2 git ruby && \
    npm install -g nan && \
    npm -g install node-gyp && \
    npm -g install iconv \
    && npm install -g coffee-script grunt grunt-cli i18next-conv bower\
    && gem update --no-document --system \
    && gem install --no-document json_pure compass \
    && gem cleanup \
    && gem sources -c && \
    ./build.sh && \
    npm -g cache clean && \
    npm cache clean && \
    apk del make autoconf automake gcc g++ ruby ruby-dev python && \
    rm -r /etc/ssl /var/cache/apk/*


VOLUME ${InstallationDir}

CMD ${InstallationDir}/start.sh
