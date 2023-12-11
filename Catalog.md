# Psychometrics Made Simple Catalog
CS 6460 Fall 2023

rwilliams306

## How to run the development server
This project is built on SvelteKit which is a framework built on top of NodeJS. Running the project locally is fairly simple and involves the following steps:

1. Install NodeJS on your computer (latest version recommended, any will do). [Download Link](https://nodejs.org/en/download).
2. Open a terminal in the main "psychometrics" folder. This can be done by unzipping the zip file provided on Canvas or cloning the repository from [this link](https://github.com/ryan-d-williams/psychometrics).
3. While inside the main folder, run the following commands: 
    1. `npm install`
    2. (once the above is complete) `npm run dev`

This will start a development server. Your terminal will tell you the link the application is available on. Copy that link to your browser to see the application.

## File Structure

### \datasets
This folder contains all the datasets used in the demo video as well as during testing and evaluation.

### \src
Source code for the application. Follows the [SvelteKit framework](https://kit.svelte.dev/).

### Everything else
All the other folders and files are config files for Svelte and are not directly related to the application (in terms of evaluation and grading)

## General Notes

There is a small bug in the code such that when you run the application for the first time (or close out and reopen) if you drag in a file and click continue after data cleaning it will error and not show the analytics. A refresh and re-dragging in the file fixes this issue. (If the analytics don't show, refresh and try again and it should be fine).