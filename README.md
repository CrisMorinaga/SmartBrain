<h1 align="center">
  <br>
  <a href="https://smartbrai.netlify.app/" target="_blank"><img src="https://github.com/CrisMorinaga/SmartBrain/assets/128830239/63b1aea3-fb59-4c6d-8ba7-070c22d1f1ed" alt="SmartBrain" width="200"></a>
  <br>
  SmartBrain
  <br>
</h1>

<h4 align="center">A website that uses Clarifai API to scan an image URL and detect faces on it. </h4>
<img width="1280" alt="HomePage" src="https://github.com/CrisMorinaga/SmartBrain/assets/128830239/d0628003-9c8f-4510-a5b5-ad8704482792">

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#tech-stack">Tech Stack</a>
</p>


## Key Features

* Face Detection - Detect faces on your pictures
  - Instantly detect 1 or more faces in your pictures.
* Image Gallery
  - Instantly save your images after every search into your gallery to check them up whenever you want to.
* Save your search history 
  - Save your search history information (like URL, date of search, and ranking of the image) into your account for future reference.
* Dark/Light mode (to implement)

## How To Use

Simply follow this <a href="https://smartbrai.netlify.app/" target="_blank">Link</a>, create an account if you want to, and you are ready to start using the website!

![How to use](https://github.com/CrisMorinaga/SmartBrain/assets/128830239/ff55b309-9911-4c10-ab12-454ad43c6cb4)

> **Note**
> When registering or logging in there might be a tiny delay, this is because the server is running on a free plan and it turns down after some minutes of inactivity. It will be fixed once the server runs on a pay plan.

## Image Gallery

![Gallery](https://github.com/CrisMorinaga/SmartBrain/assets/128830239/d872a42c-13c4-46ac-9214-7e78505261f3)

## Tech Stack

* Backend:
  - Clarifai (For the face recognition API)
  - Flask (For the backend API)
  - SQLAlchemy (ORM for Flask and PostgreSQL)
  - Flask-login (To manage user login tokens between frontend and backend)
  - Flask JWT extended (To manage user JWT tokens between frontend and backend)
  - Werkzeug Security (To manage password hashing)
* Frontend:
  - Next.js 13 (For designing the website)
  - Tailwind (For design)
  - Zod (For input validation)
  - Next-auth (For user session management and security)
  - Axios (For increased API calls security and token refreshing)
  - Shadcn-UI (For UI design)
* Database:
  - PostgreSQL

## About

Made as the final project for the course on Web Development from Zero to Mastery:

- [Clarifai](https://www.clarifai.com/)
- [ZeroToMastery](https://zerotomastery.io/)


## You may also like...

- [AI Tic-Tac-Toe](https://github.com/CrisMorinaga/Tic-Tac-Toe) - A Tic-Tac-Toe app that uses an AI with 3 levels of difficulty

---

> Linkedin [@Cristopher Morales](www.linkedin.com/in/cristopher-morales-c)

