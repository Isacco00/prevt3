pipeline {
    agent any

    environment {
        REGISTRY = "192.168.101.110:5000"
        APP = "prevt"
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

                    env.IMAGE_BUILD = "${REGISTRY}/${APP}:${TAG}"
                    env.IMAGE_LATEST = "${REGISTRY}/${APP}:${env.NAMESPACE}-latest"

                    echo "Deploying to namespace: ${env.NAMESPACE}"
                    echo "Build image: ${env.IMAGE_BUILD}"
                    echo "Latest image: ${env.IMAGE_LATEST}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${IMAGE_BUILD} .
                """
            }
        }

        stage('Push Build Image') {
            steps {
                sh """
                    docker push ${IMAGE_BUILD}
                """
            }
        }

        stage('Tag & Push Environment Latest') {
            steps {
                sh """
                    docker tag ${IMAGE_BUILD} ${IMAGE_LATEST}
                    docker push ${IMAGE_LATEST}
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-k3s', variable: 'KCFG')]) {
                    sh """
                        kubectl --kubeconfig="$KCFG" \
                          set image deployment/${APP} \
                          ${APP}=${IMAGE_LATEST} \
                          -n ${NAMESPACE}
                    """
                }
            }
        }

        stage('Check Rollout') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-k3s', variable: 'KCFG')]) {
                    sh """
                        kubectl --kubeconfig="$KCFG" \
                          rollout status deployment/${APP} \
                          -n ${NAMESPACE}
                    """
                }
            }
        }
    }
}
