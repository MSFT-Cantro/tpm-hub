# Meme Generator App

A microfrontend application built with Angular and Module Federation that allows users to create memes and copy them to the clipboard.

## Features

- Create memes with custom text on top and bottom
- Choose from pre-built meme templates
- Upload custom images
- Copy memes directly to clipboard
- Responsive design

## Prerequisites

- Node.js (v14+)
- NPM (v6+)
- Angular CLI

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open your browser and navigate to `http://localhost:4203`

## Usage in TPM Hub

This app is built as a microfrontend using Module Federation and can be integrated with the TPM Hub shell application.

## Available Meme Templates

For the application to work correctly, you'll need to download the following meme templates and place them in the `src/assets/memes/` directory:

1. drake.jpg - Drake approval meme
2. distracted-boyfriend.jpg - Distracted boyfriend meme
3. two-buttons.jpg - Two buttons decision meme
4. change-my-mind.jpg - Change my mind meme
5. expanding-brain.jpg - Expanding brain meme
6. woman-yelling-at-cat.jpg - Woman yelling at cat meme

You can find these templates on various royalty-free image sites or create your own.

## How to Use

1. Enter text for the top and bottom of your meme
2. Select a template from the dropdown or upload your own image
3. Preview your meme on the right side
4. Click "Copy to Clipboard" to copy the meme as an image
5. Paste the meme in any application that accepts images