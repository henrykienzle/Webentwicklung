document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".search-form");
  const recommendationDiv = document.getElementById("recommendation");
  const wishlistItems = document.getElementById("wishlistItems");

  // Lade die Merkliste aus dem localStorage, falls vorhanden
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  function updateWishlist() {
    wishlistItems.innerHTML = "";
    wishlist.forEach((game, index) => {
      const li = document.createElement("li");
      li.textContent = game;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "❌";
      removeBtn.style.marginLeft = "10px";
      removeBtn.onclick = () => {
        // Entferne das Spiel aus der lokalen Merkliste
        wishlist.splice(index, 1);
        updateWishlist();

        // Entferne das Spiel aus der Merkliste in der Datenbank
        fetch(`/merkliste-loeschen/${encodeURIComponent(game)}`, {
          method: 'DELETE',
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data.message);
          })
          .catch((error) => {
            console.error('Fehler beim Entfernen aus der Merkliste:', error);
          });
      };

      li.appendChild(removeBtn);
      wishlistItems.appendChild(li);
    });

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const genre = document.getElementById("genre").value;
    const mode = document.getElementById("mode").value;
    const platform = document.getElementById("platform").value;

    if (genre && mode && platform) {
      fetch('/spiele')
        .then((response) => response.json())
        .then((data) => {
          const filteredGames = data.filter(
            (spiel) =>
              spiel.genre === genre &&
              spiel.modus === mode &&
              spiel.plattform === platform
          );

          recommendationDiv.innerHTML = "";
          if (filteredGames.length > 0) {
            filteredGames.forEach((spiel) => {
              const gameElement = document.createElement("div");
              gameElement.textContent = `${spiel.titel} (${spiel.genre}, ${spiel.modus}, ${spiel.plattform})`;

              const addToWishlistBtn = document.createElement("button");
              addToWishlistBtn.textContent = "💾 Zur Merkliste hinzufügen";
              addToWishlistBtn.style.marginLeft = "10px";
              addToWishlistBtn.onclick = () => {
                if (!wishlist.includes(spiel.titel)) {
                  wishlist.push(spiel.titel);
                  updateWishlist();

                  // Füge das Spiel zur Merkliste in der Datenbank hinzu
                  fetch('/merkliste-hinzufuegen', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(spiel),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      console.log(data.message);
                    })
                    .catch((error) => {
                      console.error('Fehler beim Hinzufügen zur Merkliste:', error);
                    });
                } else {
                  alert("Dieses Spiel ist bereits in deiner Merkliste!");
                }
              };

              gameElement.appendChild(addToWishlistBtn);
              recommendationDiv.appendChild(gameElement);
            });
          } else {
            recommendationDiv.textContent = "Keine Spiele gefunden.";
          }
        })
        .catch((error) => {
          console.error("Fehler beim Abrufen der Spiele:", error);
        });
    } else {
      alert("Bitte wähle Genre, Spielmodus und Plattform aus.");
    }
  });

  updateWishlist();
});