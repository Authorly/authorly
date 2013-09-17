class AddPromoToUsers < ActiveRecord::Migration
  def up
    add_column :users, :promo, :string
  end

  def down
    remove_column :users, :promo
  end
end
