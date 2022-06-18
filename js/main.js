window.addEventListener("load", function () {
    loadRandomMichis();
});

("use strict");

const lista_carousel = document.getElementById("carousel__lista");
const punto = document.querySelectorAll(".punto");

// Cuando click en un punto
// Saber la posicion de ese punto
// Quitar la clase activo de Todos los puntos
// Añadir la clase activo al punto que hemos hecho CLICK

punto.forEach((cadaPunto, i) => {
    punto[i].addEventListener("click", () => {
        let posicion = i;
        let operacion = posicion * -50;

        lista_carousel.style.transform = `translateX(${operacion}%)`;

        punto.forEach((cadaPunto, i) => {
            punto[i].classList.remove("activo");
        });
        punto[i].classList.add("activo");
        // posicion es 0 transformX es 0
        // posicion es 1 transformX es -50
        // operacion = posicion *-50
    });
});

const URL_Random = [
    "https://api.thecatapi.com/v1/images/search",
    "?limit=2",
    "&api_key=bef0851d-5947-4fdd-8ce0-cfebeb871e4a",
].join("");

const URL_Favorites = [
    "https://api.thecatapi.com/v1/favourites",
    "?api_key=bef0851d-5947-4fdd-8ce0-cfebeb871e4a",
].join("");

const URL_Favorites_Delete = (id) =>
    [
        `https://api.thecatapi.com/v1/favourites`,
        `/${id}`,
        `?api_key=bef0851d-5947-4fdd-8ce0-cfebeb871e4a`,
    ].join(``);

const spanError = document.getElementById("error");

async function loadRandomMichis() {
    try {
        const response = await fetch(URL_Random);
        const data = await response.json();
        const status = response.status;
        if (status != 200) {
            throw new Error(`Error de petición HTTP en Random: ${status}`);
        } else console.log("Random");
        console.log(data);
        data.forEach((gato) => {
            const lista = document.getElementById("carousel__lista");
            const elemento = document.createElement("div");
            const img = document.createElement("img");
            const btn = document.createElement("button");
            const btnText = document.createTextNode("Guardar michi en favoritos");
            img.src = gato.url;
            btn.appendChild(btnText);
            btn.onclick = () => saveFavoriteMichi(gato.image.url);
            lista.appendChild(elemento);
            elemento.appendChild(img);
            elemento.appendChild(btn);
        });
    } catch (error) {
        console.log(error.message);
        spanError.innerText = `Error: ${error.message}`;
    }
}

async function loadFavoriteMichi() {
    try {
        const response = await fetch(URL_Favorites);
        const data = await response.json();
        const status = response.status;
        if (status != 200) {
            throw new Error(`Error de petición HTTP en cargar favoritos: ${status}`);
        } else {
            data.forEach((gato) => {
                const section = document.getElementById("favoritesMichis");
                const article = document.createElement("article");
                const img = document.createElement("img");
                const btn = document.createElement("button");
                const btnText = document.createTextNode("Sacar michi de favoritos");
                img.src = gato.image.url;
                btn.appendChild(btnText);
                btn.onclick = () => deleteFavoriteMichi(gato.id);
                article.appendChild(img);
                article.appendChild(btn);
                section.appendChild(article);
            });
        }
        console.log("Favorites");
        console.log(data);
    } catch (error) {
        console.log(error.message);
        spanError.innerText = `Error: ${error.message}`;
    }
}

async function saveFavoriteMichi(id) {
    try {
        const response = await fetch(URL_Favorites, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image_id: id,
            }),
        });
        console.log(response, "Guardar gatos");
        const data = await response.json();
        const status = response.status;
        if (status != 200) {
            throw new Error(`Error de petición HTTP en guardar favorito: ${status}` + data.message);
        } else {
            loadFavoriteMichi();
        }
    } catch (error) {
        console.log(error.message);
        spanError.innerText = `Error: ${error.message}`;
    }
}

async function deleteFavoriteMichi(id) {
    try {
        const response = await fetch(URL_Favorites_Delete(id), {
            method: "DELETE",
        });
        const data = await response.json();
        const status = response.status;
        if (status != 200) {
            throw new Error(
                `Error de petición HTTP en eliminar favorito: ${status}` + data.message
            );
        } else {
            console.log("Gato eliminado");
            loadFavoriteMichi();
        }
    } catch (error) {
        console.log(error.message);
        spanError.innerText = `Error: ${error.message}`;
    }
}

loadFavoriteMichi();
document.getElementById("clickMe").onclick = loadRandomMichis;
