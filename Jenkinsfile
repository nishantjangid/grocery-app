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
            steps {
                script {                    
                    sh 'npm install'
                }
            }
        }             
    }
}