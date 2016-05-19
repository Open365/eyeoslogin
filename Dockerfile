FROM docker-registry.eyeosbcn.com/eyeos-fedora21-frontend-base


ENV InstallationDir=/usr/share/nginx/html/applogin

WORKDIR ${InstallationDir}

RUN mkdir -p ${InstallationDir}

COPY . ${InstallationDir}

RUN ./build.sh

VOLUME ${InstallationDir}

CMD ${InstallationDir}/start.sh
