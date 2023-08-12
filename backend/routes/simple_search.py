from flask import Blueprint, jsonify, request

simple_search = Blueprint("simple_search", __name__) 
input = {} 

@simple_search.route('/', methods=['GET', 'POST'])
def index():
    if (request.method == 'GET'):
        return 'Ok'
    if (request.method == 'POST'):
        user_input = request.get_json()
        #validate input, generate url, scrape, add to database
        print(user_input)
        return jsonify(user_input)
    
    
# @simple_search.route('/history', methods=['GET'])
# def history():
