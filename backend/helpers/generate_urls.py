from datetime import timedelta
import queue

def generate_urls(places, start_loc, start_date, end_date, min_num_days):
    urlQ = queue.Queue(0)
    curr_date = start_date + timedelta(days=min_num_days)
    for p in places:
        urlQ.put({'search_from': start_loc, 'search_to': p.location, 'url': f"https://www.google.com/travel/flights?q=One%20way%20flights%20to%20{p.location}%20from%20{start_loc}%20on%20{start_date}"})
    for p in places:
        urlQ.put({'search_from': p.location, 'search_to': start_loc, 'url':f"https://www.google.com/travel/flights?q=One%20way%20flights%20to%20{start_loc}%20from%20{p.location}%20on%20{end_date}"})
    while (end_date - curr_date).days >= min_num_days:
        for i, p in enumerate(places): 
            for j, p2 in enumerate(places):
                if i == j:
                    continue
                urlQ.put({'search_from': p.location, 'search_to': p2.location, 'url':f"https://www.google.com/travel/flights?q=One%20way%20flights%20to%20{p2.location}%20from%20{p.location}%20on%20{curr_date}"})
        curr_date += timedelta(days=1)

    print('URLs generated!')
    return urlQ