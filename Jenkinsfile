pipeline {
    agent any
    tools {nodejs "node"}
    stages {
        stage('Lint js files') {
            steps {
                sh '''
                npm install
                npm run lint
                '''
            }
        }
    }
}