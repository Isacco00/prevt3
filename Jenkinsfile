pipeline {
    agent any

    environment {
        REGISTRY = "192.168.101.110:5000"

        APP_BE = "prevt"
        APP_FE = "prevt-webapp"

        TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Determine Environment') {
            steps {
                script {
                    echo "Branch: ${env.BRANCH_NAME}"

                    if (env.BRANCH_NAME == "test") {
                        env.NAMESPACE = "test"
                    } else if (env.BRANCH_NAME == "master") {
                        env.NAMESPACE = "produzione"
                    } else {
                        error "❌ Branch non valido: ${env.BRANCH_NAME}"
                    }

                    echo "Deploying to namespace: ${env.NAMESPACE}"
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                sh """
                    docker build \
                      -f deployment/backend/dockerfile \
                      -t ${REGISTRY}/${APP_BE}:${TAG} \
                      .

                    docker push ${REGISTRY}/${APP_BE}:${TAG}
                """
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh """
                    docker build \
                      -f deployment/frontend/Dockerfile \
                      -t ${REGISTRY}/${APP_FE}:${TAG} \
                      frontend

                    docker push ${REGISTRY}/${APP_FE}:${TAG}
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-k3s', variable: 'KCFG')]) {
                    sh """
                        kubectl --kubeconfig="$KCFG" \
                          set image deployment/prevt \
                          prevt=${REGISTRY}/${APP_BE}:${TAG} \
                          -n ${NAMESPACE}

                        kubectl --kubeconfig="$KCFG" \
                          set image deployment/prevt-webapp \
                          nginx=${REGISTRY}/${APP_FE}:${TAG} \
                          -n ${NAMESPACE}
                    """
                }
            }
        }

        stage('Check Rollout') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-k3s', variable: 'KCFG')]) {
                    sh """
                        kubectl --kubeconfig="$KCFG" rollout status deployment/prevt -n ${NAMESPACE}
                        kubectl --kubeconfig="$KCFG" rollout status deployment/prevt-webapp -n ${NAMESPACE}
                    """
                }
            }
        }
    }
}
