---
id: 4
title: "Developer Site - Admin Panel"
date: 2025-07-14
category: feature
tags: ["Sveltkit","Cursor Agent"]
---
I wanted to make a tool for performing general CRUD operations on my dev log and projects showcase without having to manually perform operations on the database. Probably should have done this right away but I wanted to get the project published since visually it is mostly complete even though there are still items that are a work in progress. I was thinking of making an external tool so I didn't have to worry about exposing the ability to edit this data, but thought I could give Cursor a chance to continue development on the website it created.

Just like before it amazed me at how quickly it could analyze my project and implement a new feature, and a pretty hefty one at that. Building a CRUD platform for manipulating data in a database isn't anything complex, but it does take a fair amount of code. With the first pass it built out all the api endpoints for performing the CRUD operations and a pretty good looking UI.

Since I am going to be the only user accessing this panel I instructed it to build a very simple authentication system. After doing it's first pass, I looked over how Cursor decided to handle the authentication. I'm glad I did because Cursor forgot to authenticate the user on the api endpoints for non-read actions and only checked on login! So if you new the http requests to send on a tool like Postman you could perform whatever actions you wanted to. We course corrected and added some extra security features like limiting login attempts and adding an expiration to logins. That is a good reminder though to be diligent when generating code that can expose your platform to attacks and potential data loss.

I have merged in the feature on github and have deployed into production. This dev log is actually being written using the feature right now!
