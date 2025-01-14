pipeline {
    agent any
    environment {
        PATH = "/usr/local/bin:$PATH"  // Adjust the path based on where Node.js is installed
    }
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
                    reuseNode true
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