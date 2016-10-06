mongo badu_navigation --eval "db.admins.remove({})"
mongo badu_navigation --eval "db.admins.save({username: 'admin', password: hex_md5('admin123')})"