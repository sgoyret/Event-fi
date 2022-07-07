#!/usr/bin/env bash
# scrpt to initialize server with dependencies to deploy our app event-fi
sudo apt-get update
sudo apt-get -y install python3-pip
# isntall packages needed
sudo pip install Flask flask_session flask_cors flask_pymongo pymongo pymongo[srv] gunicorn

# create config file for service creation, files for logs and echo config to config file
sudo touch /etc/systemd/system/event-fi.service
sudo mkdir /var/log/gunicorn
sudo touch /var/log/gunicorn/stdout
sudo touch /var/log/gunicorn/stderr
echo -e "[Unit]\nDescription=Gunicorn instance for event-fi app\nAfter=network.target\n\n[Service]\nUser=root\nGroup=www-data\nWorkingDirectory=/home/ubuntu/Event-fi\nExecStart=/usr/local/bin/gunicorn --access-logfile '/var/log/gunicorn/stdout' --log-file '/var/log/gunicorn/stderr' --capture-output --log-level debug -b localhost:8000 app:app\nRestart=always\n\n[Install]\nWantedBy=multi-user.target" | sudo tee /etc/systemd/system/event-fi.service

# enable service
sudo systemctl daemon-reload
sudo systemctl start event-fi.service
sudo systemctl enable event-fi.service

# isntall nginx as web server to route ip to localhost:8000
sudo apt-get update
sudo apt-get -y upgrade
sudo apt-get -y install nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Edit the default file in the sites-available folder.
sudo sed -i '0,/server {/s//upstream flaskevent-fi {\n\tserver 127.0.0.1:8000;\n}\nserver {/' /etc/nginx/sites-available/default
sudo sed -i 's/^\t\ttry_files $uri $uri\/ =404;/\t\tproxy_pass http:\/\/flaskevent-fi;\n/' /etc/nginx/sites-available/default
sudo systemctl restart nginx