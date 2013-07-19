require 'sinatra'
require 'active_record'
require 'mailchimp'

ENV['RACK_ENV'] ||= 'production'

config = YAML::load(ERB.new(IO.read(File.join(File.dirname(__FILE__), '..', 'db', 'config.yml'))).result)[ENV['RACK_ENV']].symbolize_keys
ActiveRecord::Base.establish_connection(config)

class User < ActiveRecord::Base
  after_create :add_to_mailchimp
  @mailchimp_api = nil

  def self.mailchimp_api
    return @mailchimp_api if @mailchimp_api
    api_key = YAML::load(ERB.new(IO.read(File.join(File.dirname(__FILE__), '..', 'config', 'mailchimp.yml'))).result)[ENV['RACK_ENV']].symbolize_keys[:api_key]

    @mailchimp_api = Mailchimp::API.new(api_key)
  end

  private

  def add_to_mailchimp
    info = {
      :id            => 'dae12d02db', # Mailchimp list id for "Authorly New User Signup" list
      :email_address => self.email,
      :double_optin  => false,
      :send_welcome  => false
    }
    # Check out documentation for listSubscribe:
    # http://apidocs.mailchimp.com/api/1.3/listsubscribe.func.php
    begin
      self.class.mailchimp_api.listSubscribe(info)
      File.open(File.join(File.dirname(__FILE__), '..', 'log', ENV['RACK_ENV'] + '.log'), 'a') do |logger|
        logger.puts("Welcome notification email sent to: #{self.email}\n")
      end
    rescue => e
      File.open(File.join(File.dirname(__FILE__), '..', 'log', ENV['RACK_ENV'] + '.log'), 'a') do |logger|
        logger.puts("Could not send welcome notification email to: #{self.email}\n")
      end
    end
  end
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
