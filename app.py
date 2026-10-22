"""
Backend Flask para la calculadora de promedios.
Ejecuta con: python app.py
Luego abre: http://127.0.0.1:5000
"""

import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

CAMPOS = [
    ("oral1", "Oral 1"),
    ("oral2", "Oral 2"),
    ("pb", "Progress Booklet"),
    ("cbg", "Cambridge One"),
    ("st", "Speaking Task"),
    ("unt3", "Unit Test 3"),
    ("unt4", "Unit Test 4"),
    ("ctest1", "Competency Test 1"),
    ("ctest2", "Competency Test 2"),
]


@app.route("/")
def home():
    return render_template("index.html", campos=CAMPOS)


@app.route("/calcular", methods=["POST"])
def calcular():
    data = request.get_json()

    try:
        notas = {clave: int(data.get(clave)) for clave, _ in CAMPOS}
    except (TypeError, ValueError):
        return jsonify({"error": "Todas las notas deben ser números enteros."}), 400

    if any(n < 0 or n > 100 for n in notas.values()):
        return jsonify({"error": "Las notas deben estar entre 0 y 100."}), 400

    promo1 = (notas["pb"] + notas["cbg"] + notas["st"]) / 3
    promo2 = (notas["unt3"] + notas["unt4"] + notas["ctest1"] + notas["ctest2"]) / 4
    promtotal = round((promo1 + promo2 + notas["oral1"] + notas["oral2"]) / 4)

    aprobado = promtotal >= 70

    return jsonify({
        "promo1": round(promo1, 2),
        "promo2": round(promo2, 2),
        "promtotal": promtotal,
        "aprobado": aprobado,
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
