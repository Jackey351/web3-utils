#!/bin/bash
target_dir='node_modules/graphql/jsutils'
if test -e ./scripts/patch/instanceOf.mjs & $target_dir/instanceOf.mjs
then
echo 'replace graphql/jsutils/instanceOf.mjs...'
cp ./scripts/patch/instanceOf.mjs $target_dir/instanceOf.mjs
fi

# target_dir='node_modules/.pnpm/graphql@16.7.1/node_modules/graphql/jsutils'
# if test -e ./scripts/patch/instanceOf.mjs
# then
# echo 'replace graphql/jsutils/instanceOf.mjs...'
# cp ./scripts/patch/instanceOf.mjs $target_dir/instanceOf.mjs
# fi

target_dir='node_modules/@composedb/client/node_modules/graphql/jsutils'
if test -e ./scripts/patch/instanceOf.mjs & $target_dir/instanceOf.mjs
then
echo 'replace graphql/jsutils/instanceOf.mjs...'
cp ./scripts/patch/instanceOf.mjs $target_dir/instanceOf.mjs
fi

target_dir='node_modules/@composedb/graphql-scalars/node_modules/graphql/jsutils'
if test -e ./scripts/patch/instanceOf.mjs & $target_dir/instanceOf.mjs
then
echo 'replace graphql/jsutils/instanceOf.mjs...'
cp ./scripts/patch/instanceOf.mjs $target_dir/instanceOf.mjs
fi

target_dir='node_modules/@composedb/runtime/node_modules/graphql/jsutils'
if test -e ./scripts/patch/instanceOf.mjs & $target_dir/instanceOf.mjs
then
echo 'replace graphql/jsutils/instanceOf.mjs...'
cp ./scripts/patch/instanceOf.mjs $target_dir/instanceOf.mjs
fi

target_dir='node_modules/@graphql-tools/merge/node_modules/graphql/jsutils'
if test -e ./scripts/patch/instanceOf.mjs & $target_dir/instanceOf.mjs
then
echo 'replace graphql/jsutils/instanceOf.mjs...'
cp ./scripts/patch/instanceOf.mjs $target_dir/instanceOf.mjs
fi

target_dir='node_modules/@graphql-tools/utils/node_modules/graphql/jsutils'
if test -e ./scripts/patch/instanceOf.mjs & $target_dir/instanceOf.mjs
then
echo 'replace graphql/jsutils/instanceOf.mjs...'
cp ./scripts/patch/instanceOf.mjs $target_dir/instanceOf.mjs
fi