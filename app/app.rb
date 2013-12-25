require 'sinatra'
require 'json'
require 'active_record'
require 'resque'
require 'logger'

ENV['RACK_ENV'] ||= 'production'

configure do
  log_file = File.open(File.join(File.dirname(__FILE__), '..', 'log', ENV['RACK_ENV'] + '.log'), 'a+')
  log_file.sync = true if ENV['RACK_ENV'] == 'development'
  logger = Logger.new(log_file)
  logger.level = Logger::DEBUG
  set :logger, logger
end

def logger; settings.logger; end

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

  before_create { generate_token(:confirmation_token) }
  before_create { generate_token(:auth_token) }

  def save_with_password
    pass = SecureRandom.base64(32).gsub(/[=+$\/]/, '')[0..8]
    self.password = pass
    self.password_confirmation = pass
    self.status = 'inactive'
    self.accepted_terms = true
    save
  end

  def generate_token(column)
    begin
      self[column] = SecureRandom.urlsafe_base64
    end while User.exists?(column => self[column])
  end
end


get '/' do
  logger.info "params: #{params.inspect}"
  erb :index
end

post '/users.json' do
  content_type :json
  logger.info "params: #{params.inspect}"
  u = User.new(params['user'])
  if u.save_with_password
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

post '/unbounce.json' do
  content_type :json
  logger.info "params: #{params.inspect}"

  user_data = JSON.parse(params['data.json'])
  u = User.new(:name => user_data['name'].first, :email => user_data['email'].first)
  if u.save_with_password
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
