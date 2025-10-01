import gsap from "gsap";
import Draggable from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export function initGaleria() {
  const posters = document.querySelectorAll(".poster");
  const galeria = document.getElementById("galeria");

  const modal = document.getElementById("modal");
  const modalTitulo = document.getElementById("modalTitulo");
  const modalPoster = document.getElementById("modalPoster");
  const modalDescripcion = document.getElementById("modalDescripcion");
  const modalLink = document.getElementById("modalLink");
  const cerrar = document.getElementById("cerrar");

  const peliculas = JSON.parse(
    document.getElementById("pelis-data").textContent
  );

  // Hacer posters arrastrables
  posters.forEach((poster) => {
    Draggable.create(poster, { bounds: galeria });

    // Click abre modal
    poster.addEventListener("click", () => {
      const pelicula = peliculas.find((p) => p._id === poster.dataset.id);
      if (pelicula) {
        modalTitulo.textContent = pelicula.titulo;
        modalPoster.src = pelicula.urlPoster;
        modalDescripcion.textContent =
          pelicula.sinopsis || "Sin sinopsis disponible.";
        modalLink.href = pelicula.linkImdb || "#";
        modal.classList.remove("hidden");
      }
    });
  });

  // Cerrar modal
  cerrar.addEventListener("click", () => modal.classList.add("hidden"));

  // Función barajar
  function shufflePosters() {
    posters.forEach((poster) => {
      gsap.to(poster, {
        duration: 0.8,
        x: 0,
        y: 0,
        rotation: Math.random() * 40 - 20,
        top: Math.random() * 70 + "%",
        left: Math.random() * 70 + "%",
        ease: "power3.inOut",
      });
    });
  }

  document
    .getElementById("shuffleBtn")
    .addEventListener("click", shufflePosters);
}
