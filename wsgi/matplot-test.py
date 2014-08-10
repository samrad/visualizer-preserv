__author__ = 'Sam'

import json
from mpl_toolkits.basemap import Basemap
from matplotlib.path import Path

# Mercator Projection
# http://matplotlib.org/basemap/users/merc.html
m = Basemap(projection='merc', llcrnrlat=-80, urcrnrlat=80,
            llcrnrlon=-180, urcrnrlon=180, lat_ts=20, resolution='c')

polys  = []
points = [[50.776204378856654, 6.07514139264822],
          [50.778063265101366, 6.078681908547878],
          [50.78012410861307, 6.076223831623793],
          [50.77981883560066, 6.075816135853529],
          [50.77993416119513, 6.076170187443495],
          [50.78114845460269, 6.074668150395155],
          [50.77814038141936, 6.060529346577823],
          [50.778194654270685, 6.060228939168155],
          [50.77828963160895, 6.060454244725406],
          [50.778836648561914, 6.072716675698757],
          [50.77611469759955, 6.079978924244642],
          [50.77580261396482, 6.078058462589979],
          [50.77619611037916, 6.077082138508558],
          [50.780790402439926, 6.077437363564968],
          [50.78195718874058, 6.073167286813259],
          [50.77844317436444, 6.070957146584988],
          [50.77798185557204, 6.0666656121611595],
          [50.77835349740038, 6.060044746845961],
          [50.776969524717245, 6.064411383122206],
          [50.78002913500056, 6.064647417515516],
          [50.77709842586344, 6.076706629246473],
          [50.777871825279874, 6.079603414982557],
          [50.77688811328396, 6.079442482441664],
          [50.77862485979052, 6.077918987721205],
          [50.77629713411306, 6.0800480749458075],
          [50.77609021013419, 6.077210297808051]]


def load_json():
    json_data = open('../static/polygons.json')
    data = json.load(json_data)
    json_data.close()
    for poly in data['polys']:
        tmp_vtx = []
        for vtx in poly['vtx']:
            tmp_x, tmp_y = m(vtx['lng'], vtx['lat'])
            tmp_vtx.append([tmp_x, tmp_y])
        polys.append(Path(tmp_vtx))


def check_points():
    for p in points:
        inside = False
        for poly in polys:
            if poly.contains_point(m(p[1], p[0])):
                inside = True
        print(inside)



p = Path([[25.774252, -80.190262], [18.466465, -66.118292], [32.321384, -64.75737]])
p1 = [27.254629577800088, -76.728515625]
lat, lng = 27.254629577800088, -76.728515625

g = [[-80.190262, 25.774252], [-66.118292, 18.466465], [-64.75737, 32.321384]]
g_t = [m(x[0], x[1]) for x in g]
g_poly = Path(g_t)

x1, y1 = m(-80.190262, 25.774252)
x2, y2 = m(-66.118292, 18.466465)
x3, y3 = m(-64.75737, 32.321384)
p_t = Path([[x1, y1], [x2, y2], [x3, y3]])

xpt, ypt = m(lng, lat)

p_t.contains_point([xpt, ypt])
p2 = [27.254629577800088, -74.928515625]
# p.contains_point(p1)
# p.contains_point(p2)

# poly = Polygon(([-80.190262, 25.774252], [-66.118292, 18.466465], [-64.75737, 32.321384]))
# p1 = Point(-76.728515625, 27.254629577800088)

# Old answer, using long/lat coordinates
# poly.contains(p1)  # False
# poly.distance(p1)  # 0.01085626429747994 degrees

# Translate to spherical Mercator or Google projection
# poly_g = transform(project, poly)
# p1_g = transform(project, p1)

# poly_g.contains(p1_g)  # True
# poly_g.distance(p1_g)  # 0.0 meters
#
# if __name__ == '__main__':
#     load_json()
#     check_points()
#     # print(xpt, ypt)
#     print(g_poly.contains_point([xpt, ypt]))
#     # print(p.contains_point(p1))
#     # print(data['polys'])
#     # print(p.contains_point(p2))
