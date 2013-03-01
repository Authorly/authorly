require 'sinatra'
require 'active_record'

ENV['RAILS_ENV'] ||= 'development'

config = YAML::load(ERB.new(IO.read(File.join(File.dirname(__FILE__), '..', 'db', 'config.yml'))).result)[ENV['RAILS_ENV']].symbolize_keys
ActiveRecord::Base.establish_connection(config)

class User < ActiveRecord::Base
end


get '/' do
  erb :index
end

post '/users' do
  if (user = User.find_by_email(params['user']['email'])).blank?
    u = User.new(params["user"])
    u.save
  end

  status 200
  body   "OK"
end
