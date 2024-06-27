// Attend que le document soit entièrement chargé avant d'exécuter la fonction
document.addEventListener('DOMContentLoaded', () => {
    // Obtient les paramètres de l'URL pour l'ID de la caméra
    const urlParams = new URLSearchParams(window.location.search);
    const cameraId = urlParams.get('id');

    // Vérifie si un ID de caméra est présent dans l'URL
    if (cameraId) {
        // Effectue une requête GET pour récupérer les détails de la caméra spécifique
        fetch(`/api/cameras/${cameraId}`)
            .then(response => response.json()) // Parse la réponse JSON
            .then(camera => {
                // Sélectionne l'élément conteneur où les détails de la caméra seront affichés
                const cameraDetailContainer = document.getElementById('camera-detail-container');

                // Crée un conteneur pour l'image de la caméra
                const imageContainer = document.createElement('div');
                imageContainer.classList.add('col-md-6', 'text-center');

                // Crée un élément img pour afficher l'image de la caméra
                const image = document.createElement('img');
                image.classList.add('img-fluid', 'rounded');
                image.src = camera.imageUrl;
                image.alt = camera.name;

                // Ajoute l'image au conteneur d'image
                imageContainer.appendChild(image);

                // Crée un conteneur pour les détails de la caméra
                const detailsContainer = document.createElement('div');
                detailsContainer.classList.add('col-md-6');

                // Crée un élément h2 pour afficher le nom de la caméra
                const title = document.createElement('h2');
                title.textContent = camera.name;

                // Crée un élément p pour afficher le prix de la caméra
                const price = document.createElement('p');
                price.classList.add('lead');
                price.textContent = `Prix: $${camera.price}`;

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

                // Crée un élément h3 pour le titre de la description
                const descriptionTitle = document.createElement('h3');
                descriptionTitle.textContent = "Description :";

                // Crée un élément p pour afficher la description de la caméra
                const description = document.createElement('p');
                description.textContent = camera.description;

                // Bouton Ajouter au panier
                const addToCartBtn = document.createElement('button');
                addToCartBtn.classList.add('btn', 'btn-primary', 'my-3');
                addToCartBtn.textContent = "Ajouter au panier";

                // Ajout de l'événement de clic pour ajouter au panier
                addToCartBtn.addEventListener('click', () => {
                    const selectedQuantity = quantitySelect.value;
                    const item = {
                        id: camera._id,
                        name: camera.name,
                        price: camera.price,
                        imageUrl: camera.imageUrl,
                        quantity: parseInt(selectedQuantity),
                        // Vous pouvez ajouter d'autres propriétés spécifiques à la caméra si nécessaire
                    };

                    // Récupération du panier depuis le localStorage ou initialisation si vide
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];

                    // Vérifie si le produit existe déjà dans le panier (même id)
                    const existingItem = cart.find(cartItem => cartItem.id === item.id);

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
                detailsContainer.appendChild(descriptionTitle);
                detailsContainer.appendChild(description);
                detailsContainer.appendChild(addToCartBtn);

                // Ajoute les conteneurs d'image et de détails au conteneur principal
                cameraDetailContainer.appendChild(imageContainer);
                cameraDetailContainer.appendChild(detailsContainer);
            })
            .catch(error => {
                // Affiche une erreur dans la console en cas de problème avec la requête fetch
                console.error('Error fetching camera details:', error);
            });
    } else {
        // Affiche une erreur dans la console si aucun ID de caméra n'est trouvé dans l'URL
        console.error('No camera ID found in URL');
    }
});
