// const URL = 'https://api.thecatapi.com/v1/images/search'

const URL_Random = [
    "https://api.thecatapi.com/v1/images/search",
    "?limit=3",
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

// fetch(URL)
// 	.then(res => res.json())
// 	.then(data => {
// 		const img = document.querySelector('img')
// 		img.src = data[0].url
// 	})

// lo mismo de arriba pero con async functions
async function loadRandomMichis() {
    try {
        const response = await fetch(URL_Random);
        const status = response.status;
        if (status != 200) throw new Error(`Error de petición HTTP en Random: ${status}`);
        const data = await response.json();
        console.log("Random");
        console.log(data);

        const img1 = document.getElementById("img1");
        const img2 = document.getElementById("img2");
        const btn1 = document.getElementById("btn1");
        const btn2 = document.getElementById("btn2");

        img1.src = data[0].url;
        img2.src = data[1].url;

        btn1.onclick = () => saveFavoriteMichi(data[0].id);
        btn2.onclick = () => saveFavoriteMichi(data[1].id);
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
            const section = document.getElementById("favoriteMichis");
            section.innerHTML = "";
            const h2 = document.createElement("h2");
            const h2Text = document.createTextNode("Michis favoritos");
            h2.appendChild(h2Text);
            section.appendChild(h2);
            data.forEach((gato) => {
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

loadRandomMichis();
loadFavoriteMichi();
document.getElementById("clickMe").onclick = loadRandomMichis;
