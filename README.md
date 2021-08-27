# Introduction

"Fitness for life" is a web app designed to estimate users' health condition and help user to control their daily calorie consumptions by recording down their daily diet and exercises so as to achieve healthier lifestyle.

Fitness for life is built with Python 3.9+Flask+SQLite3+Bootstrap 4+Vanilla Javascript

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
### Home Page
  #### Guest Home Page
  - Trending Sport
    Guest can get random sports that exist in database
  - Trending Articles
    Guest can view articles from either exercise or diet. By clicking the link, they will be redirected to Article section.
      
  <img src="/Pic/1.png" width="600" />
      
  #### User Home Page
  - Day Counter
    User can acknowledge how many days they have been using healthier to stay fit through this counter
  - Statistics Reporter
    User can know how much weight they change from the day they join healthier.
  - Week Weight Chart(Plugin: Apex Chart)
    User can know how their weight had been changed for the past 7 days and download it.
      
  <img src="/Pic/3.png" width="600" />
    
### User Authentication(Plugin: SweetAlert2, Notify.js)
  #### Sign In
  User can log in healthier either by TestAccount provided or the self-created account
  <img src="/Pic/2.png" width="600" />
  #### Registration
  - Information Input
    User can sign up by inputting their weight, age, email as well as gender, the information will be used to calculate the calorie required for each user each day.
  - Email Confirmation
    By clicking Sign Up button, healthier will send a email to users' email, users will be able to activate their account by clicking the link provided in the email.
      
  <img src="/Pic/7.png" width="600" />
    
  #### Confirmation Email Resend(Plugin: UrlSerializer)
  In order to prevent error occurred during email sending or url key time passed, making users unable to activate their accounts on first attempt, they can choose to request another activation email.
    
  <img src="/Pic/8.png" width="600" />
    
  #### Forget Password(Plugin: UrlSerializer)
  User can change their passwords by inputting their username in forget password tab, email will be sent to their email addresses to let them change their password.
    
  <img src="/Pic/9.png" width="600" />
    
### Article
  Article section are available for both user and guest.
  #### Index
  - List
      All articles will be posted in the index list, the articles has two categories, diet and exercise.
  - Tag
      Different article will have their unique tag, making users easier to find the article they are looking for
  - Pagination
      Users can use pagination setting and button to view more articles in one page or navigate easily
  - Favourite Article
      Users can add article they would like to read in the future in their favourite article list, it can be accessed from both article section and profile section
      
  <img src="/Pic/4.png" width="800" />
  
  #### Article Detail
  Users read article in this page, they can also adjust font size for better readability
    
  <img src="/Pic/5.png" width="800" />
  
### Profile
  #### Profile Tab
  - Info tab
      Contains users' up-to-date weight/height/BMI data, and customizable personal information that shown to the public.
  - Weight/BMI Statistics Chart
      Similar to home page week weight chart but can view both BMI and Weight in seperate tab
      
  <img src="/Pic/6.png" width="800" />
  
  #### Profile Edit
  - Personal Info Edit
      Users can change their description and head icon using the edit button
  - Health Profile Update
      Users can record their new height and weight, the weight can only be changed once a day and new weight update on the same day will overwrite the original same-day data, the change will reflect on their statistics charts.
      
    <img src="/Pic/16.png" width="800" />
    <img src="/Pic/17.png" width="800" />
      
  <img src="/Pic/10.png" width="800" />
  
### Health Advisor
  #### BMR Calculation
  - Exercise Frequency Check
    Users will be asked their frequency of exercise each week when they first open the health advisor tabs, the exercise frequency with combination of their health profile will calculate the BMR that is suitable for user, offering users better diet consumption limit so as to achieve their target.
    
  <img src="/Pic/14.png" width="800" />
  
  - BMR Notification
    Users will have the daily calorie consumption recommendation on the first card.
    
  <img src="/Pic/15.png" width="800" />
  
  - Target Set/Update
    Users can set either their target to be weight loss or stay fit, healthier will recommend how much calorie users should consume based on the target.
  
  <img src="/Pic/13.png" width="800" />
  
  #### Weight Advisor
  - Statistics Chart
    Users will be able to view BMI and Weight Statistics here, the stats can be view either for past week or for any month since users joined healthier.
    
  <img src="/Pic/11.png" width="800" />
  
  - Recommend Sports
    Users will be recommended sports in three different difficulty levels, they can choose to refresh the card to view other sports.
    
  <img src="/Pic/12.png" width="800" />
  
  #### Diet Advisor
  - Food Kanban(API: Edamam Recipe Search API)
    Users can add foods they consume on that day to the food kanban, the card will reflex how much calorie they consumed as will as nutrient.
    
  <img src="/Pic/20.png" width="800" />
  <img src="/Pic/19.png" width="800" />
  <img src="/Pic/18.png" width="800" />
  <img src="/Pic/21.png" width="800" />

## Plugins & Api:

- Sweet alert 2*(https://sweetalert2.github.io/)*
- Form Validation*(https://formvalidation.io/)*
- Keen Theme*(https://keenthemes.com/)*
- Notify.js*(http://notifyjs.jpillora.com/)*
- Edamam Recipe API*(https://developer.edamam.com/)*
- ApexChart*(https://apexcharts.com/)*

## Contact:

If you have any issue, feel free to contact me by email:1527638985@qq.com
