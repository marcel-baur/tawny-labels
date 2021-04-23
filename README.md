# TAWNY RAVDESS Labelling Tool

## Intro

This repository contains the code for the RAVDESS labelling tool presented for the Affective Computing Course.

To run and deploy the application, include your firebase credentials in the `.env` file in the root directory. The `.firebaserc` file might also need updates, depending on the name of your firebase application.

The videos and images are stored in the Firebase Storage.

Each video and image also has an entry in the Firestore Database `videos` and `images` collection:

```
{
  actor: string,
  emotion: string,
  name: string,
}
```

The `name` needs to match the name in the storage bucket.

## Usage

To run the project, install the dependencies first:

`yarn`

Then issue the run command:

`yarn dev`

To build and deploy the project, run the following commands:

`yarn build`

`firebase deploy --only hosting`

## Stack

Svelte + Vite + Typescript + Firebase
