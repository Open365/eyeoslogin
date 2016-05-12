FROM docker-registry.eyeosbcn.com/eyeos-fedora21-frontend-base

RUN mkdir -p /usr/share/nginx/html/applogin

COPY start.sh /
CMD /start.sh

WORKDIR /usr/share/nginx/html/applogin

COPY . /usr/share/nginx/html/applogin

RUN ./build.sh

VOLUME /usr/share/nginx/html/applogin
