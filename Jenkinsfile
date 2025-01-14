pipeline {
    agent any

    stages{
        stage('Checkout') {
            steps {
                checkout scm
            }
        }   
        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                }
            }
            steps {
                script {                    
                    sh 'npm install'
                }
            }
        }             
    }
}