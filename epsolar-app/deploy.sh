#!/bin/sh

ENV_FILES=".env .env.local .env.development .env.development.local"

for f in $ENV_FILES; do
    if [ -f "$f"  ]
    then
        echo "Loading env file $f"
        . "./$f"
    fi
done

DIR="$( cd "$( dirname "$0" )" && pwd)"
SOURCE_DIR="$DIR/build"

if [ -z "${DEPLOY_TARGET}" ]
then
    echo "No deploy target specified"
    exit
fi

echo "# Syncing from ${SOURCE_DIR} to ${DEPLOY_TARGET}"
rsync -av ${SOURCE_DIR}/ $DEPLOY_TARGET