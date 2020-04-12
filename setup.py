#!/usr/bin/python3
import os

config_file = '_config.yml'
config_file_content = ''

print('Enter app name:', end=' ')
app_name = input()

print('Enter app description:', end=' ')
app_description = input()

print('Enter your GitHub Pages url:', end=' ')
app_url = input()

print('Enter your GitHub username:', end=' ')
github_username = input()

print('Enter custom GitHub repository name:', end=' ')
github_reponame = input()


with open(config_file, 'r') as f:
	config_file_content = f.read() \
		.replace('<site title>', app_name) \
		.replace('<site description>', app_description) \
		.replace('<site url>', app_url) \
		.replace('<site baseUrl>', github_reponame)

with open(config_file, "w") as f:
	f.write(config_file_content)

os.system('git remote set-url origin git@github.com:{}/{}.git'.format(github_username, github_reponame))
os.system('git commit -a -m "init app"')
os.system('git push -u origin master')

old_dir = os.getcwd()
os.chdir('..')
os.system('mv {}/ {}'.format(old_dir, github_reponame))

print ('\nNow: cd ../{}'.format(github_reponame))
