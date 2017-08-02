git pull origin harcourts
# Clean previous build
rm -rf bower_components

# Build
bower install
gulp
