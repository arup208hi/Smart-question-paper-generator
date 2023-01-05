# # importing Flask and other modules
# from flask import Flask, request, render_template
 
# # Flask constructor
# app = Flask(__name__, template_folder='templates')


# @app.route('/')
# def index():
#     return render_template('Arup.html') 
 
# # A decorator used to tell the application
# # which URL is associated function
# @app.route('/', methods =["GET", "POST"])
# def gfg():
#     if request.method == "POST":
#        # getting input with name = fname in HTML form
#        value = request.form.get("cars")
#        # getting input with name = lname in HTML form
#     #    last_name = request.form.get("second")
#     return render_template("Arup.html", value = value)

# if __name__=='__main__':
#    app.run()
   


from multiprocessing import Value
from flask import Flask, request, render_template
app = Flask(__name__, template_folder='templates')


@app.route('/')
def index():
    return render_template('Arup.html')

@app.route('/analyze', methods=['GET', 'POST'])
def analyze():
    if request.method == 'POST':
       value = request.form.get("cars")
    return render_template("Arup.html", value = value)
    

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0")