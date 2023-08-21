from ..extensions import db
from ..models.CheapestRoute import Flight, Route
from datetime import timedelta

def generate_paths(dsts, l, r, start_loc, flexibility, start_date, search_info):
    if l == r:
        generate_routes(dsts, start_date, flexibility, [], start_loc, start_loc, search_info, 0)
    else: 
        for i in range(l, r):
            dsts[l], dsts[i] = dsts[i], dsts[l]
            generate_paths(dsts, l+1, r, start_loc, flexibility, start_date, search_info)
            dsts[l], dsts[i] = dsts[i], dsts[l]

def generate_routes(path, curr_date, flexibility, route, curr_loc, start_loc, search_info, curr_price):
    if flexibility == 0 and len(path) == 0:
        flight = Flight.query.filter(Flight.search == search_info, Flight.date == curr_date, Flight.search_from == curr_loc, Flight.search_to == start_loc).first()
        route.append(flight)
        price = curr_price + flight.price
        rte = Route(price=price, search=search_info)
        for f in route:
            rte.flights.append(f)
        db.session.add(rte)
    
    else:
        if flexibility > 0 and route != []:
            generate_routes(path, curr_date + timedelta(days=1), flexibility - 1, route, curr_loc, start_loc, search_info, curr_price)
        if len(path) != 0:
            new_route = route[:]
            flight = Flight.query.filter(Flight.search == search_info, Flight.date == curr_date, Flight.search_from == curr_loc, Flight.search_to == path[0].location).first()
            new_route.append(flight)
            new_price = curr_price + flight.price
            new_date = curr_date + timedelta(days=int(path[0].num_days))
            new_loc = path[0].location
            new_path = path[1:]
            generate_routes(new_path, new_date, flexibility, new_route, new_loc, start_loc, search_info, new_price)