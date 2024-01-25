# 2610 Django + Vite Starting Point
This project is a fork of a starting point provided by Joseph Ditton [here](https://github.com/dittonjs/2610DjangoViteStarter.git). This starting point featured what was necessary to use Django as a backend and Vite running React for the frontend.

## The Idea
This app is designed for a photographer to share photos with clients. The client can log in and submit a request for a photography session. The photographer can log in and see this request on the staff page. From here, they can arrange an actual meeting time, and update the website to reflect this. The client can see the appointment. Once the photos have been taken and edited, the photographer can then upload them to the site through the staff portal. Now the client can see their photos from their side of the website. They can select and download as many or as few of their own photos as they'd like.

## Initial Setup
1. In the root directory, install the python dependencies `poetry install`
2. In the `client` directory, install the javascript dependencies `npm install`
3. In the `_server` directory, create a new file called `.env`
4. Copy the contents of `_server/.env.example` into the newly created `.env` file.
5. Activate the poetry env `poetry shell`
6. In the `_server` directory, run the migrations `python manage.py migrate`

## Running the appliction
1. In the `client` directory run `npm run dev`
2. In the `_server` directory (with your poetry env activated) run `python manage.py runserver`
3. Visit the application at `http://localhost:8000`
