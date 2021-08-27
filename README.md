# Introduction

"Fitness for life" is a web app designed to estimate users' health condition and give suggestion based on bmi value so
as to achieve healthier lifestyle, this app is developed based on the prototype of my 2018 Fall semester project done in
Nanyang Polytechnic on a topic named smart life.

Fitness for life is built with Python 3.9+Flask+SQLite3+Bootstrap 4

> **The web app has been deployed on: https://healthier-fitness.azurewebsites.net/**

## Index

- [Install](#install)
- [Features](#features)
- [Api](#api)

## Install

Install and update using pip:

```
pip install -U Flask
```

## Features:
- Home Page
  - Guest Home Page
    1. Trending Sport
      Guest can get random sports that exist in database
    2. Trending Articles
      Guest can view articles from either exercise or diet. By clicking the link, they will be redirected to Article section.
      <img src="/Pic/1.png" width="800" />
  - User Home Page
    1.Day Counter
      User can acknowledge how many days they have been using healthier to stay fit through this counter
    2.Statistics Reporter
      User can know how much weight they change from the day they join healthier.
    3.Week Weight Chart(Plugin: Apex Chart)
      User can know how their weight had been changed for the past 7 days and download it.
    <img src="/Pic/3.png" width="800" />
- User Authentication(Plugin: SweetAlert2, Notify.js)
  - Sign In
    User can log in healthier either by TestAccount provided or the self-created account
    <img src="/Pic/2.png" width="800" />
  - Registration
    1.Information Input
      User can sign up by inputting their weight, age, email as well as gender, the information will be used to calculate the calorie required for each user each day.
    2.Email Confirmation
      By clicking Sign Up button, healthier will send a email to users' email, users will be able to activate their account by clicking the link provided in the email.
    <img src="/Pic/7.png" width="800" />
  - Confirmation Email Resend(Plugin: UrlSerializer)
    In order to prevent error occurred during email sending or url key time passed, making users unable to activate their accounts on first attempt, they can choose to request another activation email.
    <img src="/Pic/8.png" width="800" />
  - Forget Password(Plugin: UrlSerializer)
    User can change their passwords by inputting their username in forget password tab, email will be sent to their email addresses to let them change their password.
    <img src="/Pic/9.png" width="800" />
- Article
  Article section are available for both user and guest.
  - Index
    1.List
      All articles will be posted in the index list, the articles has two categories, diet and exercise.
    2.Tag
      Different article will have their unique tag, making users easier to find the article they are looking for
    3.Pagination
      Users can use pagination setting and button to view more articles in one page or navigate easily
    4.Favourite Article
      Users can add article they would like to read in the future in their favourite article list, it can be accessed from both article section and profile section
  <img src="/Pic/4.png" width="800" />
  - Article Detail
    Users read article in this page, they can also adjust font size for better readability
  <img src="/Pic/5.png" width="800" />
- Profile
  - Profile Tab
    1.Info tab
      Contains users' up-to-date weight/height/BMI data, and customizable personal information that shown to the public.
    2.Weight/BMI Statistics Chart
      Similar to home page week weight chart but can view both BMI and Weight in seperate tab
  <img src="/Pic/6.png" width="800" />
  - Profile Edit
    1.Personal Info Edit
      Users can change their description and head icon using the edit button
    2.Health Profile Update
      Users can record their new height and weight, the weight can only be changed once a day and new weight update on the same day will overwrite the original same-day data, the change will reflect on their statistics charts.
  <img src="/Pic/10.png" width="800" />
- Health Advisor
![Health Advisor Exercise Frequency Check](/Pic/14.png)
![Health Advisor BMR notification](/Pic/15.png)
![Health Target Set](/Pic/13.png)
  - Weight Advisor
![Weight Advisor Stats](/Pic/11.png)
![Weight Advisor Recommend Sports](/Pic/12.png)
![User weight update](/Pic/16.png)
![Weight Stat Change](/Pic/17.png)
  - Diet Advisor
![Food Kanban](/Pic/20.png)
![Add Food Menu](/Pic/19.png)
![Food Weight Input](/Pic/18.png)
![Diet Monitor](/Pic/21.png)


## Api:

- Sweet alert 2*(https://sweetalert2.github.io/)*
- Form Validation*(https://formvalidation.io/)*
- Keen Theme*(https://keenthemes.com/)*

## Contact:

If you have any issue or question, feel free to contact me by email:1527638985@qq.com
