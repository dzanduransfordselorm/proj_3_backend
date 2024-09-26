# NEBULA BACKEND PROJECT

This repository contains a Node.js backend application that runs in a Docker container. The following guide will help you clone the project, set up the environment, build the Docker image, and run the container.

## Prerequisites

Before getting started, make sure you have the following installed:

1. **Git**: To clone the project.
2. **Docker**: To build and run the application inside a Docker container.

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

Replace `<repository-url>` with the actual URL of the Git repository, and `<repository-directory>` with the name of the directory created after cloning.

Run the project on the "UsingRDBMS" branch
 
### 3. Build Docker Image

Use the following command to build the Docker image for your Nebula Backend App.

```bash
docker build -t nebula-backend-app .
```

- `-t` option tags the image (you can change the name `nebula-backend-app` to your preferred image name).
- The `.` at the end tells Docker to use the `Dockerfile` in the current directory.

### 4. Run Docker Container

Once the image is built, run the Docker container with the following command:

```bash
docker run -d -p 9000:9000 nebula-backend-app
```

- `-d` runs the container in detached mode.
- `-p 9000:9000` maps port 9000 on the host to port 9000 in the container (you can modify the port if necessary).
- `--name nebula-backend-app` assigns a name to the running container.


### 5. Access the Application

If the container is running successfully, you can access your Node.js application by navigating to:

```
http://localhost:9000
```

Or replace `localhost` with the appropriate domain or IP if it's running in a different environment.

Feel free to customize the README further based on your project's specific setup or requirements!
