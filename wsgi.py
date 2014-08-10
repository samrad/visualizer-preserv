!/usr/bin/python
import os

class HelloWorld(object):
    def index(self):
        return "Hello, World!"
    index.exposed = True

# if we are running at openshift and not locally, initialize openshift
#  python virtualenv
if __name__ != "__main__":
    virtenv = os.environ['OPENSHIFT_PYTHON_DIR'] + '/virtenv/'
    virtualenv = os.path.join(virtenv, 'bin/activate_this.py')
    try:
        execfile(virtualenv, dict(__file__=virtualenv))
    except IOError:
        pass
#
# IMPORTANT: Put any additional includes below this line.  If placed above this
# line, it's possible required libraries won't be in your searchable path
#

import cherrypy

if __name__ != "__main__":
    # we run cherrypy as wsgi responder so set environment profile as "embedded"
    cherrypy.config.update({'environment': 'embedded'})
    # create and start WSGI application framework / application by CherryPy
    application = cherrypy.Application(HelloWorld(), script_name=None, config=None)
else:
    # start cherrypy locally
    cherrypy.quickstart(HelloWorld(), config=None)

# eof