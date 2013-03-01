require 'app/app'

set :environment, ENV['RACK_ENV'].to_sym
set :app_file,    'app/app.rb'
disable :run

log = File.new("logs/#{ENV['RACK_ENV']}", "a")
STDOUT.reopen(log)
STDERR.reopen(log)

run Sinatra::Application
