import random
import json
"""
N = 0
NE = 1
E = 2
SE = 3
S = 4
SW = 5
W = 6
NW = 7
"""
class Node():
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.discovered = False
    def get_location(self):
        return self.x, self.y
    def get_discovered(self):
        return self.discovered
    def discover(self):
        pass
    def is_empty(self):
        pass
    def json(self):
        pass
    def _str_(self):
        pass

class FullNode(Node):
    def __init__(self, x, y, location = None):
        super().__init__(x, y)
        self.location = location

    def is_empty(self):
        return False
    def discover(self, location):
        self.discover = True
        self.location = location

    def json(self):
        #print(self.x, self.y)
        if self.location is not None:
            newjson = {
                "location" : self.location[0],
                        "description" : self.location[1],
                        "characters" : self.location[2]
            }
        else:
            newjson = None
        return newjson
    def _str_(self):
        return str(self.location)

class EmptyNode(Node):
    def __init__(self, x, y, name=None, eventType=None, description=None):
        super().__init__(x, y)
        self.discovered = True
    def is_empty(self):
        return True
    def json(self):
        #print(self.x, self.y)
        location = {"location" : "",
                    "description" : "",
                    "characters" : []}
        return location
    def _str_(self):
        return "Empty"

class Map():
    def __init__(self):
        self.map = []
        for i in range(9):
            self.map.append([None] * 9)
        self.cols_added_left = 0
        
        self.rows_added_above = 0
        
        self.map[4][4] = FullNode(4, 4)
    def getcell(self, x,y):
        #print(x + self.cols_added_left, y + self.rows_added_above)
        return self.map[x + self.cols_added_left][y + self.rows_added_above]
    def cartesian_to_index(self, x, y):
        return x + self.cols_added_left, y + self.rows_added_above
 
    def calculate_neighbours(self,currentNode):
        neighbours = [None] * 8
        x, y = currentNode.get_location()
        if y > 0 - self.rows_added_above:
            neighbours[0] = self.getcell(y-1,x)
            if x < len(self.map[y])-self.cols_added_left-1:
                neighbours[1] = self.getcell(y-1,x+1)
            if x > 0 - self.cols_added_left:
                neighbours[7] = self.getcell(y-1,x-1)
        if y < len(self.map)-self.rows_added_above - 1:
            neighbours[4] = self.getcell(y+1,x)
            if x < len(self.map[y])-self.cols_added_left-1:
                neighbours[3] = self.getcell(y+1,x+1)
            if x > 0 - self.cols_added_left:
                neighbours[5] = self.getcell(y+1,x-1)
        if x > 0 - self.cols_added_left:
            neighbours[6] = self.getcell(y,x-1)
        if x < len(self.map[0])-self.cols_added_left-1:
            neighbours[2] = self.getcell(y,x+1)
        return neighbours
    def _str_(self):
        s = ""
        for line in self.map:
            s += str(line) + "\n"
        return s
    def get_dimension(self):
        return len(self.map[0]), len(self.map)

    # something wrong with how coordinates calculated
    # places a node next to the x,y node dependent on the location parameter as defined at the start
    def placenode(self, x, y, location, node):
        xadj, yadj = get_adjustment(location)
        ix, iy = self.cartesian_to_index(x + xadj, y + yadj)
        """if ix + xadj < 0:
            self.add_col_left()
            
        
        if iy + yadj < 0:
            self.add_row_above() 
           
            
        if ix + xadj  == len(self.map[0]) - 1:
            self.add_col_right()
        if iy + yadj  == len(self.map) - 1:
            self.add_row_below()
        ix, iy = self.cartesian_to_index(x, y)
        print(xadj + ix , yadj + iy)
        self.map[xadj + ix][yadj + iy] = node"""
        print(ix, iy)
        self.map[ix][iy] = node

    def get_map(self):
        return self.map
    def add_row_above(self):
        self.map.insert(0, [None] * len(self.map[0]))
        self.rows_added_above += 1
    def add_row_below(self):
        self.map.append([None] * len(self.map[0]))
        
    def add_col_left(self):
        for row in self.map:
            row.insert(0, None)
        self.cols_added_left += 1
    def add_col_right(self):
        for row in self.map:
            row.append(None)
      
            
def get_adjustment(location):
    if location == 0:
        return 0, -1
    if location == 1:
        return 1, -1
    if location == 2:
        return 1, 0
    if location == 3:
        return 1, 1
    if location == 4:
        return 0, 1
    if location == 5:
        return -1, 1
    if location == 6:
        return -1, 0
    if location == 7:
        return -1, -1

    
class NodeGenerator():
    #expects a list of names and a list of descriptions of size 4
    @staticmethod
    def generate_nodes(map, currentnode):
        x, y = currentnode.get_location()
        neighbours = map.calculate_neighbours(currentnode)
        num_spaces = 4
        placable_nodes = []
        for count, neighbour in enumerate(neighbours):
            if neighbour != None:
                if not neighbour.is_empty():
                    num_spaces -= 1
            else:
                placable_nodes.append(count)
        if num_spaces > len(placable_nodes):
            num_spaces = len(placable_nodes)
        num = 0
        if num_spaces > 0:
            num = random.randint(1, num_spaces)
        locations_to_place = random.sample(placable_nodes, num)
        #locations_to_place = random.sample(placable_nodes, 4)
        print(locations_to_place)
        for location in placable_nodes:
            """print(location)
            newX, newY = get_adjustment(location)
            newX += x
            newY += y"""
            newX, newY = map.cartesian_to_index(x,y)
            if newX == 0:
                map.add_col_left()
            if newY == 0:
                map.add_row_above()
            w, h = map.get_dimension()
            if newX == w:
                map.add_col_right()
            if newY == h:
                map.add_col_below()
            print(newX, newY)
            newX, newY = get_adjustment(location)
            newX += x
            newY += y
            if location in locations_to_place:
                print("placed in", x, y)
                map.placenode(x, y, location, FullNode(newX, newY,))
            else:
                map.placenode(x,y, location, EmptyNode(newX, newY))
        
    

class Game():
    def __init__(self):
        self.current_x = 4
        self.current_y = 4
        self.locations = []
        self.characters = []
        self.map = None
        
    def start(self, locations, characters):
        self.map = Map()
        self.current_x = 4
        self.current_y = 4
        self.locations = locations

        print(self.locations)
        self.characters = characters
        print(self.characters)
        currentCell = self.map.getcell(self.current_x, self.current_y)
        print(currentCell)
        currentCell.discover(self.locations[0])
        self.locations.pop(0)
        NodeGenerator.generate_nodes(self.map, currentCell)
        #return self.return_state(0, 0)
        return self.return_state(self.current_x, self.current_y)

    def move(self, changeX, changeY):
        self.current_x += changeX
        self.current_y += changeY
        currentCell = self.map.getcell(self.current_x, self.current_y)
        
        if currentCell.get_discovered():
            print("cell is discovered")
            return self.return_state(self.current_x, self.current_y)
        else:
            print("not")
            NodeGenerator.generate_nodes(self.map, currentCell)
            num = random.randint(0, len(self.locations) - 1)
            currentCell.discover(self.locations[num])
            self.locations.pop(num)
            return self.return_state(self.current_x, self.current_y)

                    
    def return_state(self, x, y):
        print(self.map)
        json_map = {"locations": {
            
            "[0, 0]": self.map.getcell(x-1, y-1).json(),
            "[1, 0]": self.map.getcell(x, y-1).json(),
            "[2, 0]": self.map.getcell(x+1, y-1).json(),
            "[0, 1]": self.map.getcell(x-1, y).json(),
            "[1, 1]": self.map.getcell(x, y).json(),
            "[2, 1]": self.map.getcell(x+1, y).json(),
            "[0, 2]": self.map.getcell(x-1, y+1).json(),
            "[1, 2]": self.map.getcell(x, y+1).json(),
            "[2, 2]": self.map.getcell(x+1, y+1).json(),
            
            },
            "characters" : self.characters,
            "num_locations" : len(self.locations)
        }
        print(json.dumps(json_map))
        return json.dumps(json_map)
