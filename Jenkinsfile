pipeline {
  agent any

  environment {
    // Use the exact name from Jenkins > Configure System > SonarQube Servers
    SONARQUBE_ENV = 'LocalSonar'
  }

  tools {
    nodejs 'NodeJS-18'      // Make sure it's configured in Global Tool Configuration
    // If sonar-scanner CLI is installed via Jenkins, mention it here if needed
  }

  stages {
    stage('Clone Repository') {
      steps {
        git 'https://github.com/<your-username>/todo-ci-cd.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Linting') {
      steps {
        echo '🔍 Running HTML/CSS/JS linting...'
        // Avoid failing pipeline due to lint issues (using || true)
        sh 'npx eslint . || true'
        sh 'npx stylelint "**/*.css" || true'
      }
    }

    stage('Code Quality Check - SonarQube') {
      steps {
        echo '🚀 Running SonarQube Analysis...'
        withSonarQubeEnv("${env.SONARQUBE_ENV}") {
          sh 'sonar-scanner'
        }
      }
    }

    stage('SonarQube Quality Gate') {
      steps {
        echo '⏳ Waiting for SonarQube Quality Gate result...'
        timeout(time: 1, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          docker.build('todo-webapp')
        }
      }
    }

    stage('Run Docker Container') {
      steps {
        echo '🐳 Starting Docker container...'
        sh '''
          docker rm -f todo-container || true
          docker run -d -p 8080:80 --name todo-container todo-webapp
        '''
      }
    }
  }

  post {
    success {
      echo '✅ Build Successful'
      // Optional: Add Slack or email notifications here
    }
    failure {
      echo '❌ Build Failed'
      // Optional: Add error alerting/notification
    }
  }
}
