pipeline {
  agent any

  tools {
    // Make sure NodeJS is installed if using linters like eslint/stylelint
    nodejs 'NodeJS-18'  // Configure this in Jenkins > Global Tool Configuration
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
        // Assuming you have eslint and stylelint configured
        sh 'npx eslint . || true'
        sh 'npx stylelint "**/*.css" || true'
      }
    }

    stage('Code Quality Check') {
      steps {
        withSonarQubeEnv('LocalSonar') {
          sh 'sonar-scanner'
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
        // Stops existing container and runs a new one
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
      // You can add Slack or Email notifications here
    }
    failure {
      echo '❌ Build Failed'
      // Add alerts here too
    }
  }
}
