#!/bin/sh
set -e
set -x

if [[ -n $EYEOS_LANGUAGE ]]; then
    sed -i "s/lang: '[^']*',/lang: '$EYEOS_LANGUAGE',/" build/js/platformSettings.js
fi

if [[ -n $EYEOS_LOGIN_CLEAN_URL_PARAMETERS ]]; then
    sed -i "s/cleanUrlParameters: .*,/cleanUrlParameters: $EYEOS_LOGIN_CLEAN_URL_PARAMETERS,/" build/js/platformSettings.js
fi

if [[ -n $EYEOS_LOGIN_TITLE ]]; then
    sed -i "s/customTitle: .*,/customTitle: '$EYEOS_LOGIN_TITLE',/" build/js/platformSettings.js
fi

if [[ -n $EYEOS_DISABLE_ANALYTICS ]]; then
    sed -i "s/disableAnalytics: .*,/disableAnalytics: '$EYEOS_DISABLE_ANALYTICS',/" build/js/platformSettings.js
fi

if [[ -n $EYEOS_LOGIN_SUGGEST_DOMAIN ]]; then
    sed -i "s/suggestDomain: .*,/suggestDomain: $EYEOS_LOGIN_SUGGEST_DOMAIN,/" build/js/platformSettings.js
fi

if [[ -n $EYEOS_LOGIN_DOMAIN_FROM_URL ]]; then
    sed -i "s/domainFromUrl: .*,/domainFromUrl: $EYEOS_LOGIN_DOMAIN_FROM_URL,/" build/js/platformSettings.js
fi

if [[ -n $EYEOS_LOGIN_DOMAIN_FROM_URL_EXCEPTIONS ]]; then
    sed -i "s/domainFromUrlExceptions: .*,/domainFromUrlExceptions: '$EYEOS_LOGIN_DOMAIN_FROM_URL_EXCEPTIONS',/" build/js/platformSettings.js
fi

if [[ -n $EYEOS_LOGIN_DEFAULT_DOMAIN ]]; then
    sed -i "s/defaultDomain: .*,/defaultDomain: '$EYEOS_LOGIN_DEFAULT_DOMAIN',/" build/js/platformSettings.js
fi

if [[ -n $EYEOS_LOGIN_FORCE_DOMAIN ]]; then
    sed -i "s/forceDomain: .*,/forceDomain: $EYEOS_LOGIN_FORCE_DOMAIN,/" build/js/platformSettings.js
fi

if [[ -n $EYEOS_LOGIN_ENABLE_USER_REGISTRATION ]]; then
    sed -i "s/enableUserRegistration: .*,/enableUserRegistration: $EYEOS_LOGIN_ENABLE_USER_REGISTRATION,/" build/js/platformSettings.js
fi

while true
do
	sleep 9999d
done
