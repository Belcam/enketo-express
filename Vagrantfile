# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty32"
  config.vm.box_url = "ubuntu/trusty32"
  config.vm.network :forwarded_port, host: 8006, guest: 8005
  config.vm.network :forwarded_port, host: 35729, guest: 35729
  config.vm.provider :virtualbox do |vb|
      vb.customize ["modifyvm", :id, "--memory", "2024", "--cpus", 1]
  end

  config.vm.provision :shell, :path => "setup/bootstrap.sh"

end
