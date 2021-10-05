
// CONSTANTES & VARIABLES -------------------------------------------------------
const $modal = document.querySelector(".modal"),
    $form = document.getElementById("form"),
    $inputs = document.querySelectorAll(".form [required"),
    $books = document.querySelector(".books"),
    $book = document.querySelector(".book"),
    $bookStatus = document.querySelector(".book-status"),
    $btnStatus = document.querySelector(".btn-status"),
    $btnTheme = document.querySelector(".btn-theme"),
    $btnThemeIcon = document.querySelector(".btn-theme i"),
    $selectors = document.querySelectorAll("[data-dark]"),
    $template = document.getElementById("template-card").content,
    $fragment = document.createDocumentFragment();

let library = [];

// FUNCIONES ----------------------------------------------------------
const lightMode = () => {
    $selectors.forEach(el => {
        el.classList.remove("dark-theme");
    });
    $btnThemeIcon.classList.remove("fa-sun");
    $btnThemeIcon.classList.add("fa-moon");
    localStorage.setItem("theme", "light");
};

const darkMode = () => {
    $selectors.forEach(el => {
        el.classList.add("dark-theme");
    });
    $btnThemeIcon.classList.remove("fa-moon");
    $btnThemeIcon.classList.add("fa-sun");
    localStorage.setItem("theme", "dark");
};

const saveLibrary = (array) => {
    localStorage.setItem("library", JSON.stringify(array));
}

const getLibrary = () => {
    return JSON.parse(localStorage.getItem("library"));
}

const addBook = () => {
    const title = document.getElementById("titulo").value,
        author = document.getElementById("autor").value,
        pages = document.getElementById("paginas").value,
        status = document.getElementById("estatus").checked ? "Read" : "Not Read";

    library.push({ title, author, pages, status });
}

const changeBookStatus = (el) => {
    el.target.parentElement.parentElement.parentElement.classList.toggle("is-active");
    el.target.parentElement.classList.toggle("is-read");
    el.target.classList.toggle("is-on");

    let child = el.target.parentElement.parentElement.parentElement,
        parent = child.parentNode,
        index = Array.prototype.indexOf.call(parent.children, child);

    if (library[index].status === "Read") {
        library[index].status = "Not Read";
    } else {
        library[index].status = "Read";
    }
    saveLibrary(library);
}

const getBookCards = (array) => {
    array.forEach(el => {
        $template.querySelector(".book-title").innerHTML = el.title;
        $template.querySelector(".book-author").innerHTML = `Autor: ${el.author}`;
        $template.querySelector(".book-pages").innerHTML = `${el.pages} p.p`;

        if (el.status === "Read") {
            $template.querySelector(".book").classList.add("is-active");
            $template.querySelector(".book-status").classList.add("is-read");
            $template.querySelector(".btn-status").classList.add("is-on");
        }

        let $clone = document.importNode($template, true);
        $fragment.appendChild($clone);
    });
    $books.appendChild($fragment);
}

const addCard = (el) => {
    $template.querySelector(".book-title").innerHTML = el.title;
    $template.querySelector(".book-author").innerHTML = `Por: ${el.author}`;
    $template.querySelector(".book-pages").innerHTML = `${el.pages} p.p`;

    if (el.status === "Read") {
        $template.querySelector(".book").classList.add("is-active");
        $template.querySelector(".book-status").classList.add("is-read");
        $template.querySelector(".btn-status").classList.add("is-on");
    } else {
        $template.querySelector(".book").classList.remove("is-active");
        $template.querySelector(".book-status").classList.remove("is-read");
        $template.querySelector(".btn-status").classList.remove("is-on");
    }

    let $clone = document.importNode($template, true);
    $fragment.appendChild($clone);
    $books.appendChild($fragment);
}

const deleteBook = (el) => {
    let child = el.target.parentElement,
        parent = child.parentNode,
        index = Array.prototype.indexOf.call(parent.children, child);
    parent.removeChild(child);
    library.splice(index, 1);
    saveLibrary(library);
}

// EVENTOS ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", (e) => {
    if (localStorage.getItem("theme") === null) {
        localStorage.setItem("theme", "light");
    }

    if (localStorage.getItem("theme") === "light") {
        lightMode();
    }

    if (localStorage.getItem("theme") === "dark") {
        darkMode();
    }

    if (localStorage.getItem("library") === null) {
        localStorage.setItem("library", library);
    }

    library = getLibrary();
    getBookCards(getLibrary()); //

});

document.addEventListener("click", (e) => {
    if (e.target.matches(".btn-open-form") || e.target.matches(".btn-open-form *")) {
        $modal.style.display = "flex";
    }

    if (e.target.matches(".btn-close-form")) {
        $modal.style.display = "none";
        $form.reset();
    }

    if (e.target.matches(".btn-delete")) {
        deleteBook(e);
    }

    if (e.target.matches(".btn-status")) {
        changeBookStatus(e);
    }

    if (e.target.matches(".btn-theme") || e.target.matches(".btn-theme *")) {
        if ($btnThemeIcon.classList.contains("fa-moon")) {
            darkMode();
        } else {
            lightMode();
        }
    }

});

document.addEventListener("submit", (e) => {
    e.preventDefault();

    addBook();
    saveLibrary(library);
    addCard(library[library.length - 1]);

    $modal.style.display = "none";
    $form.reset();
});