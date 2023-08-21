from ..models.CheapestRoute import Route

def format_return():
    ret = {'savedRoutes': []}
    results = Route.query.filter_by(favorited=True).all()
    for i, r in enumerate(results):
        flights = []
        for f in r.flights: 
            f = {'dptAirport': f.dpt_airport, 'arrAirport': f.arr_airport, 'dptTime': f.dpt_time, 'arrTime': f.arr_time, 'date': f.date, 
                    'airline': f.airline, 'duration': f.duration, 'layover': f.layover, 'price': f.price, 'flightURL': f.url, 'searchFrom': f.search_from, 'searchTo': f.search_to}
            if len(flights) == 0 or f['date'] > flights[-1]['date']:
                flights.append(f)
            else:
                for i, fl in enumerate(flights):
                    if f['date'] < fl['date']:
                        flights.insert(i, f)
                        break

        pathInfo = []
        for i, f in enumerate(flights): 
            if i == 0:
                pathInfo.append({'location': f['searchFrom'], 'numDays': 0})
            else:
                pathInfo.append({'location': f['searchFrom'], 'numDays': (f['date'] - flights[i - 1]['date']).days})
        rte = {'price': r.price, 'flights': flights, 'path': pathInfo, 'favorited':r.favorited, 'id': r.id}
        ret['savedRoutes'].append(rte)

    return ret