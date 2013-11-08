require 'sinatra'
require 'json'
require 'active_record'
require 'mailchimp'
require 'resque'

ENV['RACK_ENV'] ||= 'production'

config = YAML::load(ERB.new(IO.read(File.join(File.dirname(__FILE__), '..', 'db', 'config.yml'))).result)[ENV['RACK_ENV']].symbolize_keys
ActiveRecord::Base.establish_connection(config)

resque_config = YAML::load(ERB.new(IO.read(File.join(File.dirname(__FILE__), '..', 'db', 'resque.yml'))).result)[ENV['RACK_ENV']]
Resque.redis = resque_config

class MailerQueue
  @queue = :mailer
end

class User < ActiveRecord::Base
  has_secure_password

  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i
  validates_uniqueness_of :email, :case_sensitive => false, :message => 'is in use.'
  validates_presence_of :email

  after_create :add_to_mailchimp
  before_create { generate_token(:confirmation_token) }

  @mailchimp_api = nil

  def self.mailchimp_api
    return @mailchimp_api if @mailchimp_api
    api_key = YAML::load(ERB.new(IO.read(File.join(File.dirname(__FILE__), '..', 'config', 'mailchimp.yml'))).result)[ENV['RACK_ENV']].symbolize_keys[:api_key]

    @mailchimp_api = Mailchimp::API.new(api_key)
  end

  def save_with_empty_password
    pass = SecureRandom.base64(32).gsub(/[=+$\/]/, '')[0..8]
    self.password = pass
    self.password_confirmation = pass
    self.status = 'inactive'
    save
  end

  def generate_token(column)
    begin
      self[column] = SecureRandom.urlsafe_base64
    end while User.exists?(column => self[column])
  end

  private

  def add_to_mailchimp
    info = {
      :id            => 'dae12d02db', # Mailchimp list id for "Authorly New User Signup" list
      :email_address => self.email,
      :double_optin  => false,
      :send_welcome  => false,
    }

    #if self.promo.to_s.match(/\A\d\d\d\w\w\w\Z/) # If promo code matches 'XXXYYY' Where X is a letter and Y is a digit
      #info[:merge_vars] = { 'PCODE' => self.promo.to_s }
    #end

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

post '/users.json' do
  content_type :json
  u = User.new(params['user'])
  if u.save_with_empty_password
    resp = { :name => u.name, :email => u.email, :id => u.id }
    Resque.enqueue(MailerQueue, 'UserMailer', 'email_confirmation', u.id)
  else
    resp = u.errors.messages
    # Use this flag in XHR request for error handling.
    resp[:error] = 'oops'
  end

  status 200
  resp.to_json
end
