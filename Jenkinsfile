pipeline {
    agent any

    environment {
        REGISTRY = "192.168.101.110:5000"

        APP_BE = "prevt"
        APP_FE = "prevt-webapp"
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

                    env.IMAGE_BE = "${REGISTRY}/${APP_BE}:${env.NAMESPACE}-latest"
                    env.IMAGE_FE = "${REGISTRY}/${APP_FE}:${env.NAMESPACE}-latest"

                    echo "Deploying to namespace: ${env.NAMESPACE}"
                    echo "Backend image: ${env.IMAGE_BE}"
                    echo "Frontend image: ${env.IMAGE_FE}"
                }
            }
        }

        stage('Build & Push Backend Image') {
            steps {
                sh """
                    docker build \
                      -f deployment/backend/dockerfile \
                      -t ${IMAGE_BE} \
                      .

                    docker push ${IMAGE_BE}
                """
            }
        }

        stage('Build & Push Frontend Image') {
            steps {
                sh """
                    docker build \
                      -f deployment/frontend/Dockerfile \
                      -t ${IMAGE_FE} \
                      .

                    docker push ${IMAGE_FE}
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-k3s', variable: 'KCFG')]) {
                    sh """
                        kubectl --kubeconfig="$KCFG" \
                          set image deployment/prevt \
                          prevt=${IMAGE_BE} \
                          -n ${NAMESPACE}

                        kubectl --kubeconfig="$KCFG" \
                          set image deployment/prevt-webapp \
                          nginx=${IMAGE_FE} \
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
                        kubectl --kubeconfig="$KCFG" rollout status deployment/p
