#!/bin/bash
set -e

install_aws() {
  echo "************** AWS Install Start **************"
  curl --silent "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip -q awscliv2.zip
  ./aws/install
  echo "************** AWS Install Done **************"
}

setup_creds() {
  echo "************** Creds Setup Start **************"

  mkdir -p /.aws-oidc

  AWS_WEB_IDENTITY_TOKEN_FILE=/.aws-oidc/web_identity_token

  echo "$BITBUCKET_STEP_OIDC_TOKEN" >>$AWS_WEB_IDENTITY_TOKEN_FILE

  chmod 400 $AWS_WEB_IDENTITY_TOKEN_FILE

  aws configure set web_identity_token_file ${AWS_WEB_IDENTITY_TOKEN_FILE}

  aws configure set role_arn $LSQ_BuildARN

  unset AWS_ACCESS_KEY_ID
  unset AWS_SECRET_ACCESS_KEY

  export AWS_DEFAULT_REGION=$LSQ_AWSRegion

  echo "************** Creds Setup Done **************"
}

push_assets_to_s3() {
  echo "********* Deploy - START *********"
  aws s3 cp --quiet  --recursive --cache-control="max-age=31536000, public" ./build s3://$1
  aws s3 cp --quiet  --cache-control="max-age=0, no-cache, no-store, must-revalidate" ./build/index.html s3://$1
  # aws s3 cp --quiet s3://lsq-marvin-app-containerapp-dev-sgp/content/js/lsqmarvinappintegrator.js s3://${1}js/lsqmarvinappintegrator.js
  echo "********* Deploy - END *********"
}

invalidate_cdn() {
  echo "************** Invalidation - START **************"
  aws cloudfront create-invalidation --distribution-id $1 --paths "/*"  && err=0 && break || err=$?
  echo "************** Invalidation - END **************"
}

install_chrome(){
  set -euxo pipefail

  # Add Chrome's apt-key
  echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | tee -a /etc/apt/sources.list.d/google.list
  wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -

  # Install NodeJS and Google Chrome
  apt-get update
  apt-get install -y google-chrome-stable
  export CHROME_PATH=$(which google-chrome-stable)
}

setup_aws() {
  echo "************** AWS Setup Start **************"
  install_aws
  setup_creds
  echo "************** AWS Setup Done **************"
}

lighthouse_deploy(){
  echo "********* Lighthouse Build Deploy - START *********"
  push_assets_to_s3 $LSQ_S3_Lighthouse_Deploy_Bucket
  invalidate_cdn $LSQ_S3_Lighthouse_CDN_Id
  echo "********* Lighthouse Build Deploy - END *********"
}

replace_env_config(){
  echo "********* Replace Env-Config - START *********"
  cp ./env-configs/${env}/${region}-config.js ./build/env-config.js
  cp ./env-configs/${env}/newrelic.js ./build/newrelic.js
  sed -i "s|1.0.11001|$LSQ_Version|g" ./build/index.html
  sed -i "s|src=\"|src=\"$LSQ_Domain|g" ./build/index.html
  sed -i "s|1.0.110011|$LSQ_Version|g" ./build/env-config.js
  sed -i "s|href=\"main|href=\"${LSQ_Domain}main|g" ./build/index.html
  sed -i "s|url(|url($LSQ_Domain|g" ./build/index.html
  echo "********* Replace Env-Config - END *********"
}

run_lighthouse() {
  #### Get Named Arguments as Input while executing Script ####
  while [ $# -gt 0 ]; do
    if [[ $1 == *"--"* ]]; then
      param="${1/--/}"
      declare "$param"="$2"
      echo "$1 --- $2"
    fi
    shift
  done
  source ./cicd/pipeline-vars/${env}/${region}_env.sh
  if [[ ! -z "$LSQ_S3_Lighthouse_Deploy_Bucket" ]]; then
    echo "********* Lighthouse Execution - START *********"
    export LSQ_Domain=$LSQ_Lighthouse_Domain
    setup_aws
    replace_env_config
    lighthouse_deploy
    install_chrome
    npm install -g @lhci/cli
    lhci autorun
    echo "********* Lighthouse Execution - END *********"
  fi
}

deploy_build(){
  echo "********* Build Deploy - START *********"
  if [[ ! -z "$LSQ_S3_SourceMap_Bucket" ]]; then
    push_source_map_s3 $LSQ_S3_SourceMap_Bucket
  fi
  push_assets_to_s3 $LSQ_S3_Deploy_Bucket
  invalidate_cdn $LSQ_CDN_Id
  echo "********* Build Deploy - END *********"
}

remove_source_maps(){
  echo "********* Remove Source Map - START *********"
  find ./build -type f \( -name '*.map' \) -delete
  echo "********* Remove Source Map - END *********"
}

push_source_map_s3(){
  echo "********* Push Source Map - START *********"
  aws s3 rm --recursive --quiet s3://$1/${env}/
  aws s3 cp --recursive --quiet --exclude "*" --include "*.map" ./build s3://$1/${env}/
  echo "********* Push Source Map - END *********"
  remove_source_maps
}

deploy(){
  #### Get Named Arguments as Input while executing Script ####
  while [ $# -gt 0 ]; do
    if [[ $1 == *"--"* ]]; then
      param="${1/--/}"
      declare "$param"="$2"
      echo "$1 --- $2"
    fi
    shift
  done
  source ./cicd/pipeline-vars/${env}/${region}_env.sh
  #### This required for stage & prod deploy since deploy steps are manual and not getting deployed as in integration env(build and deploy happens in same step) ####
  # Check if the environment is 'stage' or 'prod'
  if [[ "$env" == "stage" || "$env" == "prod" ]]; then
   setup_aws
  fi
  replace_env_config
  deploy_build
}

addCodeArtifact() {
  echo "************** Code Artifact Start **************"
  aws codeartifact login --tool npm --repository app-package-dev --domain marvin-artifact-dev --domain-owner 309422450306 --region ap-south-1
  echo "************** Code Artifact Done **************"
}

build_setup(){
  source ./cicd/pipeline-vars/integration/sgp_env.sh
  setup_aws
  addCodeArtifact
}

"$@"