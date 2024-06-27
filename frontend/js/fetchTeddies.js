// Attend que le document soit entièrement chargé avant d'exécuter la fonction
document.addEventListener('DOMContentLoaded', () => {
    // Effectue une requête GET à l'API pour récupérer la liste des nounours
    fetch('/api/teddies')
        .then(response => response.json()) // Parse la réponse JSON
        .then(teddies => {
            // Sélectionne l'élément conteneur où les cartes des nounours seront affichées
            const teddyContainer = document.getElementById('teddy-container');

            // Pour chaque nounours dans la liste récupérée
            teddies.forEach(teddy => {
                // Crée un élément div pour la carte du nounours
                const card = document.createElement('div');
                card.classList.add('card', 'm-3', 'shadow');

                // Crée un élément img pour afficher l'image du nounours
                const image = document.createElement('img');
                image.classList.add('card-img-top', 'img-fluid');
                image.src = teddy.imageUrl;
                image.alt = teddy.name;
                image.style.cursor = 'pointer';

                // Ajoute un écouteur d'événement pour rediriger vers la page du produit lorsque l'image est cliquée
                image.addEventListener('click', () => {
                    window.location.href = `produits.html?id=${teddy._id}`;
                });

                // Crée un élément div pour le corps de la carte
                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                // Crée un élément h5 pour le titre de la carte, affichant le nom du nounours
                const title = document.createElement('h5');
                title.classList.add('card-title');
                title.textContent = teddy.name;

                // Crée un élément p pour afficher le prix du nounours
                const price = document.createElement('p');
                price.classList.add('card-text');
                price.textContent = `Prix: $${teddy.price}`;

                // Ajoute le titre et le prix au corps de la carte
                cardBody.appendChild(title);
                cardBody.appendChild(price);

                // Ajoute l'image et le corps de la carte à la carte
                card.appendChild(image);
                card.appendChild(cardBody);

                // Ajoute la carte complète au conteneur de nounours
                teddyContainer.appendChild(card);
            });
        })
        .catch(error => {
            // Affiche une erreur dans la console en cas de problème avec la requête fetch
            console.error('Error fetching teddies:', error);
        });
});
