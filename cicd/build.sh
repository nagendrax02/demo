#!/bin/bash
set -e

install_pkgs() {
  echo "********* INSTALL PACKAGES - START *********"
  npm i -g pnpm@7.13.6
  pnpm i --frozen-lockfile
  echo "********* INSTALL PACKAGES - END *********"
}

build_size_check() {
  echo "********* Build Analysis - START *********"
  npm run build:analyze:cicd
  build_size=$(node cicd/get-build-size.js)
  echo "BUILD SIZE: ====>>>> $build_size Bytes"
  export LSQ_Max_Allowed_Build_Size=410000
  if [ $build_size -gt $LSQ_Max_Allowed_Build_Size ]; then
    echo "!!!! BUILD SIZE EXCEEDED THE RECOMMENDED LIMIT of 380KB !!!!"
    echo "Please optimize your Initial Build size."
    exit 1
  fi
  echo "********* Build Analysis - END *********"
}

code_quality_check() {
  echo "********* CODE QUALITY CHECK - START *********"
  npm run quality:check
  build_size_check
  echo "********* CODE QUALITY CHECK - END *********"
}

build() {
  #### Get Named Arguments as Input while executing Script ####
  while [ $# -gt 0 ]; do
    if [[ $1 == *"--"* ]]; then
      param="${1/--/}"
      declare "$param"="$2"
      echo "$1 --- $2"
    fi
    shift
  done
  #### Build happens only once per environment and from SGP as the region ####
  source ./cicd/pipeline-vars/${env}/sgp_env.sh
  echo "********* BUILD - START *********"
  install_pkgs
  export SOURCE_MAP_DOMAIN=$LSQ_SourceMap_Domain
  export APP_ENV=${env}
  npm run build:pipe
  echo "********* BUILD - END *********"
}

sonarqube_scan() {
  if [ "${BITBUCKET_PR_DESTINATION_BRANCH}" = "develop" ] || [ "${BITBUCKET_BRANCH}" = "develop" ] || [ "${BITBUCKET_BRANCH}" = "main" ] || [ "${BITBUCKET_BRANCH}" = "feature/new-design-system" ] || [ "${BITBUCKET_PR_DESTINATION_BRANCH}" = "feature/new-design-system" ]; then
    echo "********* SONAR TESTING - START *********"
    install_pkgs
    pnpm --package=@sonar/scan dlx sonar-scanner
    echo "********* SONAR TESTING - END *********"
  fi
}

build_quality_test() {
  echo "********* CODE QUALITY TEST - START *********"
  install_pkgs
  code_quality_check
  echo "********* CODE QUALITY TEST - END *********"
}
run_unit_test_sonarqube_scan() {
  echo "********* CODE QUALITY TEST - START *********"
  install_pkgs
  npm run test
  echo "********* CODE QUALITY TEST - END *********"
  sonarqube_scan
}
run_unit_test() {
  echo "********* CODE QUALITY TEST - START *********"
  install_pkgs
  npm run test
  echo "********* CODE QUALITY TEST - END *********"
}

"$@"
