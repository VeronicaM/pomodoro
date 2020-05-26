pipeline {
    agent any
    tools {nodejs "node"}
    stages {
        stage('Lint js files') {
            steps {
                sh 'npm run lint'
            }
        }
    }
}