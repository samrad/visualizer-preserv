__author__ = 'Sam'

import json
from mpl_toolkits.basemap import Basemap
from matplotlib.path import Path
from utils.random_coords_rect import RandomCoordsRect


class CoordsClassifier:
    """examine input coordinates to see whether they
    are inside predefined polygons or not"""

    def __init__(self):
        # Mercator Projection
        # http://matplotlib.org/basemap/users/merc.html
        self.m = Basemap(projection='merc', llcrnrlat=-80, urcrnrlat=80,
                         llcrnrlon=-180, urcrnrlon=180, lat_ts=20, resolution='c')
        self.polys = []

    def read_json(self):
        json_data = open('../static/polygons.json')
        data = json.load(json_data)
        json_data.close()
        for poly in data['polys']:
            vtx_projected = [self.m(x['lng'], x['lat']) for x in poly['vtx']]
            self.polys.append(Path(vtx_projected))

    def classify(self):
        points = RandomCoordsRect(50.781500, 6.041382, 50.774625, 6.084642).get(50000)
        points_projected = [self.m(x[1], x[0]) for x in points]
        occupants = [0] * len(self.polys)
        for idx, poly in enumerate(self.polys):
            for p in points_projected:
                if poly.contains_point(p):
                    occupants[idx] += 1
        return occupants

#
# if __name__ == '__main__':
#     test = CoordsClassifier()
#     test.read_json()
#     print(test.classify())

