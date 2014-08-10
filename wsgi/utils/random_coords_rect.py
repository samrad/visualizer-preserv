__author__ = 'Sam'

from random import random
import math


class RandomCoordsRect:
    """random coordinate generator within boundary"""

    def __init__(self, n, w, s, e):
        self.north_limit = math.radians(n)
        self.west_limit = math.radians(w)
        self.south_limit = math.radians(s)
        self.east_limit = math.radians(e)

    def get(self, number=1):

        result = []

        # Loop [number] of times
        for x in range(0, number):

            # Random numbers between 0 and 1.0
            rnd1 = random()
            rnd2 = random()

            # Compute a random latitude
            result_lat = math.asin(rnd1 *
                                   (math.sin(self.north_limit) - math.sin(self.south_limit)) +
                                   math.sin(self.south_limit))

            # Find the width of the rectangular region.
            width = self.east_limit - self.west_limit

            if width < 0:
                width += 2 * math.pi

             # Compute the random longitude between westLimit and eastLimit
            result_lng = self.west_limit + width * rnd2

            if result_lng < -math.pi:
                result_lng += 2 * math.pi
            elif result_lng > math.pi:
                result_lng -= 2 * math.pi

            result.append([math.degrees(result_lat), math.degrees(result_lng)])

        return result








