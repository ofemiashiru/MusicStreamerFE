# Music Player

Music Player inspired by Spotifys player and playlist, showcasing some of my own instrumental production that I have made.
This project uses Next.js, Spring Boot (which can be found [here](https://github.com/ofemiashiru/MusicStreamerBE)) and S3 on AWS to store the audio and image files.

Still in progress:

## Iteration #1

![Current Image of Music Player](/README_files/music_player_so_far.png)

## Iteration #2

- Added navbar that collapses when screen is smaller, accompanied by a burger menu.
- Repositioned playlist so that it appears when the album art in the bottom left is clicked.
- Restyled the player colours and icons.

![Current Image of Music Player](/README_files/music_player_so_far_2.png)

## Iteration #3

- Added search bar to playlist to allow users to search for tracks.
- Added ability to load albums into the music player and link songs based on albumid.
- Restyled the player.

![Current Image of Music Player](/README_files/music_player_so_far_3.png)

## Iteration #4

- Added ability to subscribe via stripe and log in via cognito
- Added search bar to albums

![Current Image of Music Player](/README_files/music_player_so_far_4.png)

## Iteration #5

- Added Modal for Login
- Added Stripe component
- Redesign log in form

![Current Image of Music Player](/README_files/music_player_so_far_5.png)

## Iteration #6

- Update Hero section
- Fix session dropping out on refresh
- Make more responsive
- Add events

![Current Image of Music Player](/README_files/music_player_so_far_6.png)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
