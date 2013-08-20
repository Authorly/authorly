authorly
========

Sinatra version of Authorly.com

Structure
---------
`app/app.rb` - Sinatra application.
`app/views/index.erb` - Index page of the application.
`app/public` - All the static files(CSS and Javascript) and other pages.
    css, js – self-explanatory; all JavaScript is based on jQuery
    img – images used in css
    images –  images used in content with img tag (icons, images in "features", etc)
    uploads – all book covers

Starting up Application
---------
1. Install all the gems
  `bundle install`
2. Migrate the database
  `bundle exec rake db:migrate RAILS_ENV=production`
3. Start the server
   `ruby app/app.rb RACK_ENV=production &`

Submit buttons
--------------
All submit buttons are disabled (prev.default) so if you don't want to use my poor man's validator, remove it along with the function.

Changing the video
------------------
To change the video, replace the URL in line 9 of functions.js.

Notes
------
Table in About us, showing "Made by Authorly" books – I couldn't find any other solution, looks okay, but in html it's a horror
CSS – very long and messy :/
Most of the pages are validated : there are some errors with meta tags, no big deal

Any questions? Call, write, yell, shout :)
Good night!
Greg
