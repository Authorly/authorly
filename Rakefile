#!/usr/bin/env rake

require 'active_record'
require 'yaml'
require 'erb'


namespace :db do
  desc "Run the migration in a particular environment"
  task :migrate => :environment do
    ActiveRecord::Migrator.migrate('db/migrate', ENV["VERSION"] ? ENV["VERSION"].to_i : nil )
  end
end

desc 'loads up the environment'
task :environment do
  ENV['RACK_ENV'] ||= 'development'
  config = YAML::load(ERB.new(IO.read(File.join(File.dirname(__FILE__), 'db', 'config.yml'))).result)[ENV['RACK_ENV']].symbolize_keys
  ActiveRecord::Base.establish_connection(config)
end
