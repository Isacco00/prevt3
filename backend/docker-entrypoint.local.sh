#!/bin/bash

# Visualizza i profili attivi di Spring Boot
echo "----------------------------------------------------------------------"
echo "|              SPRING BOOT ACTIVE PROFILES"
echo "----------------------------------------------------------------------"

mvn spring-boot:run \
  -Dmaven.repo.local=/root/.m2 \
  -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"
