# Next frontend for a face recognition based authentication system

I created this as part of a college project laboratory project. The project is a face recognition based authentication system.

This app is the frontend for the project. It is capable of handling user authentication, user registration, through communication with the projects [face recognition API](https://github.com/ger0nymo/face-authentication-be)

The app utilizes **[Next.js](https://nextjs.org/)** and **[shadcn/ui](https://ui.shadcn.com/)**.

## Getting Started

1. Install the dependencies
```bash
yarn install
```
2. Run the development server
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage
Users can register and login to the app. 

Users can switch between dark/light theme and can enable/disable face recognition authentication.

In order to enable face recognition authentication, they will be prompted to take a photo of their face that can be registered in the database as an embedding vector.

If they have face recognition enabled, they will be prompted to authenticate using their face, starting from the very next login.
