import os
import sys
import json
import string
import random

sys.stdout = sys.stderr
sys.path.append(os.path.join(os.environ['OPENSHIFT_REPO_DIR'], u"wsgi"))

import atexit
import threading
import cherrypy
from utils.coords_classifier import CoordsClassifier

# Path to static directory
repo = os.environ['OPENSHIFT_REPO_DIR']
STATIC_DIR = os.path.join(repo, u"wsgi", u"static")

cherrypy.config.update({'environment': 'embedded'})

if cherrypy.__version__.startswith('3.0') and cherrypy.engine.state == 0:
    cherrypy.engine.start(blocking=False)
    atexit.register(cherrypy.engine.stop)


class Root(object):
    incoming = [13]
    _cp_config = {'tools.staticdir.on': True,
                  'tools.staticdir.dir': STATIC_DIR,
                  'tools.staticdir.index': 'bs-index.html',
    }

    @cherrypy.expose
    def index(self):
        return open(os.path.join(STATIC_DIR, u'bs-index.html'))

    @cherrypy.expose
    def generate(self, coords):
        return ''.join(random.sample(string.hexdigits, int(coords)))

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def monkey(self):
        polys = open(os.path.join(STATIC_DIR, u'polygons.json'))
        polys_json = json.load(polys)
        return polys_json

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def rhino(self):
        classifier = CoordsClassifier()
        classifier.read_json(os.path.join(STATIC_DIR, u'polygons.json'))
        return classifier.classify()

    @cherrypy.expose
    def accept(self, data):
        Root.incoming = json.loads(data)
        return "ACK"

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def dingo(self):
        return Root.incoming


application = cherrypy.Application(Root(), script_name=None, config=None)

