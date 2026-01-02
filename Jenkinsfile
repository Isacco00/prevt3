pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        REGISTRY = "192.168.101.110:5000"
        APP_BE   = "prevt"
        APP_FE   = "prevt-webapp"
    }

    stages {

        stage('Determine Environment') {
            steps {
                script {
                    echo "🌱 Branch: ${env.BRANCH_NAME}"

                    if (env.BRANCH_NAME == "test") {
                        env.NAMESPACE = "test"
                        env.ENV_NAME  = "test"
                    } else if (env.BRANCH_NAME == "master") {
                        env.NAMESPACE = "produzione"
                        env.ENV_NAME  = "prod"
                    } else {
                        error "❌ Branch non supportato: ${env.BRANCH_NAME}"
                    }

                    env.TAG = "${env.ENV_NAME}-${env.BUILD_NUMBER}"

                    env.IMAGE_BE = "${REGISTRY}/${APP_BE}:${env.TAG}"
                    env.IMAGE_FE = "${REGISTRY}/${APP_FE}:${env.TAG}"

                    env.IMAGE_BE_LATEST = "${REGISTRY}/${APP_BE}:latest"
                    env.IMAGE_FE_LATEST = "${REGISTRY}/${APP_FE}:latest"

                    echo "📦 Backend image:  ${env.IMAGE_BE}"
                    echo "📦 Frontend image: ${env.IMAGE_FE}"
                    echo "📍 Namespace: ${env.NAMESPACE}"
                }
            }
        }

        stage('Build & Push Images') {
            parallel {

                stage('Backend') {
                    steps {
                        sh """
                            docker build -f deployment/backend/dockerfile \
                              -t ${IMAGE_BE} \
                              -t ${IMAGE_BE_LATEST} .

                            docker push ${IMAGE_BE}
                            docker push ${IMAGE_BE_LATEST}
                        """
                    }
                }

                stage('Frontend') {
                    steps {
                        sh """
                            docker build -f deployment/frontend/Dockerfile \
                              -t ${IMAGE_FE} \
                              -t ${IMAGE_FE_LATEST} .

                            docker push ${IMAGE_FE}
                            docker push ${IMAGE_FE_LATEST}
                        """
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-k3s', variable: 'KCFG')]) {
                    sh """
                        set -e

                        kubectl --kubeconfig="$KCFG" set image deployment/prevt \
                          prevt=${IMAGE_BE} -n ${NAMESPACE}

                        kubectl --kubeconfig="$KCFG" set image deployment/prevt-webapp \
                          nginx=${IMAGE_FE} -n ${NAMESPACE}

                        kubectl --kubeconfig="$KCFG" annotate deployment/prevt \
                          build=${BUILD_NUMBER} \
                          git-commit=${GIT_COMMIT} \
                          env=${ENV_NAME} \
                          --overwrite -n ${NAMESPACE}

                        kubectl --kubeconfig="$KCFG" annotate deployment/prevt-webapp \
                          build=${BUILD_NUMBER} \
                          git-commit=${GIT_COMMIT} \
                          env=${ENV_NAME} \
                          --overwrite -n ${NAMESPACE}
                    """
                }
            }
        }

        stage('Check Rollout') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-k3s', variable: 'KCFG')]) {
                    sh """
                        kubectl --kubeconfig="$KCFG" rollout status deployment/prevt \
                          -n ${NAMESPACE} --timeout=120s

                        kubectl --kubeconfig="$KCFG" rollout status deployment/prevt-webapp \
                          -n ${NAMESPACE} --timeout=120s
                    """
                }
            }
        }

        stage('Docker Cleanup (Jenkins Node)') {
            steps {
                sh """
                    echo "🧹 Cleaning local Docker images"
                    docker image prune -af
                    docker container prune -f
                """
            }
        }
    }

    post {
        failure {
            echo "🔥 DEPLOY FALLITO → Rollback automatico"

            withCredentials([file(credentialsId: 'kubeconfig-k3s', variable: 'KCFG')]) {
                sh """
                    kubectl --kubeconfig="$KCFG" rollout undo deployment/prevt \
                      -n ${NAMESPACE}

                    kubectl --kubeconfig="$KCFG" rollout undo deployment/prevt-webapp \
                      -n ${NAMESPACE}
                """
            }
        }

        success {
            echo "✅ Deploy completato con successo (${ENV_NAME})"
        }
    }
}
