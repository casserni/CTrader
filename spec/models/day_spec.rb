require 'rails_helper'

RSpec.describe Day, type: :model do
  it { should have_valid(:date).when(Date.new) }
  it { should_not have_valid(:date).when(nil)}

end
