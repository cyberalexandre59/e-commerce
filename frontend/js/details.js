// Attend que le document soit entièrement chargé avant d'exécuter la fonction
document.addEventListener('DOMContentLoaded', () => {
    // Obtient les paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const teddyId = urlParams.get('id');

    // Vérifie si un ID de nounours est présent dans l'URL
    if (teddyId) {
        // Effectue une requête GET pour récupérer les détails du nounours spécifique
        fetch(`/api/teddies/${teddyId}`)
            .then(response => response.json()) // Parse la réponse JSON
            .then(teddy => {
                // Sélectionne l'élément conteneur où les détails du nounours seront affichés
                const teddyDetailContainer = document.getElementById('teddy-detail-container');

                // Crée un conteneur pour l'image du nounours
                const imageContainer = document.createElement('div');
                imageContainer.classList.add('col-md-6', 'text-center');

                // Crée un élément img pour afficher l'image du nounours
                const image = document.createElement('img');
                image.classList.add('img-fluid', 'rounded');
                image.src = teddy.imageUrl;
                image.alt = teddy.name;

                // Ajoute l'image au conteneur d'image
                imageContainer.appendChild(image);

                // Crée un conteneur pour les détails du nounours
                const detailsContainer = document.createElement('div');
                detailsContainer.classList.add('col-md-6');

                // Crée un élément h2 pour afficher le nom du nounours
                const title = document.createElement('h2');
                title.textContent = teddy.name;

                // Crée un élément p pour afficher le prix du nounours
                const price = document.createElement('p');
                price.classList.add('lead');
                price.textContent = `Prix: $${teddy.price}`;

                // Création du sélecteur pour la quantité
                const quantityLabel = document.createElement('label');
                quantityLabel.textContent = "Quantité:";

                const quantitySelect = document.createElement('select');
                quantitySelect.classList.add('form-select', 'mb-3');

                // Ajout des options de quantité (de 1 à 10 par exemple)
                for (let i = 1; i <= 10; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    quantitySelect.appendChild(option);
                }

                // Création du sélecteur pour les couleurs
                const colorLabel = document.createElement('label');
                colorLabel.textContent = "Choisir la couleur:";

                const colorSelect = document.createElement('select');
                colorSelect.classList.add('form-select', 'mb-3');

                // Ajout des options de couleurs disponibles pour le nounours
                teddy.colors.forEach(color => {
                    const option = document.createElement('option');
                    option.value = color;
                    option.textContent = color;
                    colorSelect.appendChild(option);
                });

                // Crée un élément h3 pour le titre de la description
                const descriptionTitle = document.createElement('h3');
                descriptionTitle.textContent = "Description :";

                // Crée un élément p pour afficher la description du nounours
                const description = document.createElement('p');
                description.textContent = teddy.description;

                // Bouton Ajouter au panier
                const addToCartBtn = document.createElement('button');
                addToCartBtn.classList.add('btn', 'btn-primary', 'my-3');
                addToCartBtn.textContent = "Ajouter au panier";

                // Ajout de l'événement de clic pour ajouter au panier
                addToCartBtn.addEventListener('click', () => {
                    const selectedQuantity = quantitySelect.value;
                    const selectedColor = colorSelect.value;
                    const item = {
                        id: teddy._id,
                        name: teddy.name,
                        price: teddy.price,
                        imageUrl: teddy.imageUrl,
                        quantity: parseInt(selectedQuantity),
                        color: selectedColor
                    };

                    // Récupération du panier depuis le localStorage ou initialisation si vide
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];

                    // Vérifie si le produit existe déjà dans le panier (même id et même couleur)
                    const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.color === item.color);

                    if (existingItem) {
                        // Si le produit existe déjà, incrémente la quantité
                        existingItem.quantity += item.quantity;
                    } else {
                        // Sinon, ajoute le nouvel article au panier
                        cart.push(item);
                    }

                    // Sauvegarde du panier mis à jour dans le localStorage
                    localStorage.setItem('cart', JSON.stringify(cart));

                    // Informe l'utilisateur que l'article a été ajouté au panier
                    alert('L\'article a été ajouté au panier.');

                    // Redirige vers la page du panier
                    window.location.href = '/panier.html';
                });

                // Ajout des éléments au conteneur des détails
                detailsContainer.appendChild(title);
                detailsContainer.appendChild(price);
                detailsContainer.appendChild(quantityLabel);
                detailsContainer.appendChild(quantitySelect);
                detailsContainer.appendChild(colorLabel);
                detailsContainer.appendChild(colorSelect);
                detailsContainer.appendChild(descriptionTitle);
                detailsContainer.appendChild(description);
                detailsContainer.appendChild(addToCartBtn);

                // Ajoute les conteneurs d'image et de détails au conteneur principal
                teddyDetailContainer.appendChild(imageContainer);
                teddyDetailContainer.appendChild(detailsContainer);
            })
            .catch(error => {
                // Affiche une erreur dans la console en cas de problème avec la requête fetch
                console.error('Error fetching teddy details:', error);
            });
    } else {
        // Affiche une erreur dans la console si aucun ID de nounours n'est trouvé dans l'URL
        console.error('No teddy ID found in URL');
    }
});
