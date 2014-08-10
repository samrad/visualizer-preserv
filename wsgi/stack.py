__author__ = 'Sam'

from mpl_toolkits.basemap import Basemap
from matplotlib.path import Path
from utils.random_coords_rect import RandomCoordsRect


# Mercator Projection
# http://matplotlib.org/basemap/users/merc.html
m = Basemap(projection='merc', llcrnrlat=-80, urcrnrlat=80,
            llcrnrlon=-180, urcrnrlon=180, lat_ts=20, resolution='c')

# Poly vertices
p = [[25.774252, -80.190262], [18.466465, -66.118292], [32.321384, -64.75737]]

# Projected vertices
p_projected = [m(x[1], x[0]) for x in p]

# Create the Path
p_path = Path(p_projected)

# Test points
p1 = [27.254629577800088, -76.728515625]
p2 = [27.254629577800088, -74.928515625]

# Test point projection
p1_projected = m(p1[1], p1[0])
p2_projected = m(p2[1], p2[0])

random_coords = RandomCoordsRect(50.781500, 6.041382, 50.774625, 6.084642)
points = random_coords.get(50)

# if __name__ == '__main__':
#     print(points)
#     print(p_path.contains_point(p1_projected))
#     print(p_path.contains_point(p2_projected))

