pipeline {
    agent any
    stages {
        stage('Lint js files') {
            steps {
                withNPM(npmrcConfig:'dedcb8e7-37b9-4112-a072-ecd7f74e93a2'){
                    sh 'npm run lint'
                }
            }
        }
    }
}