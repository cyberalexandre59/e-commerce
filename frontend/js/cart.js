// Attend que le document soit entièrement chargé avant d'exécuter la fonction
document.addEventListener('DOMContentLoaded', () => {
    // Sélectionne l'élément conteneur des articles du panier
    const cartItemsContainer = document.getElementById('cart-items');
    let totalAmount = 0;

    // Récupère le panier du localStorage ou initialise un tableau vide si le panier est vide
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Met à jour le localStorage avec le contenu actuel du panier
    const updateLocalStorage = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    // Ajoute un article au panier ou met à jour la quantité s'il existe déjà
    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.color === item.color);

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.push(item);
        }

        updateLocalStorage();
        displayCart();
    };

    // Supprime un article du panier
    const removeFromCart = (itemId, itemColor) => {
        cart = cart.filter(item => !(item.id === itemId && item.color === itemColor));
        updateLocalStorage();
        displayCart();
    };

    // Vide le panier
    const clearCart = () => {
        cart = [];
        updateLocalStorage();
        displayCart();
    };

    // Met à jour la quantité d'un article dans le panier
    const updateQuantity = (itemId, itemColor, newQuantity) => {
        cart = cart.map(item => {
            if (item.id === itemId && item.color === itemColor) {
                item.quantity = newQuantity;
            }
            return item;
        });
        updateLocalStorage();
        displayCart();
    };

    // Affiche le contenu du panier
    const displayCart = () => {
        // Vide le conteneur d'articles avant de le remplir
        cartItemsContainer.innerHTML = '';
        totalAmount = 0;

        // Pour chaque article dans le panier
        cart.forEach(item => {
            // Crée les éléments nécessaires pour afficher les détails de l'article
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('col-md-6', 'mb-4');

            const card = document.createElement('div');
            card.classList.add('card', 'h-100');

            const image = document.createElement('img');
            image.classList.add('card-img-top');
            image.src = item.imageUrl;
            image.alt = item.name;

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const title = document.createElement('h5');
            title.classList.add('card-title');
            title.textContent = item.name;

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.classList.add('form-control', 'mb-2');
            quantityInput.value = item.quantity;
            quantityInput.min = 1;
            quantityInput.addEventListener('change', (event) => {
                const newQuantity = parseInt(event.target.value);
                if (newQuantity >= 1) {
                    updateQuantity(item.id, item.color, newQuantity);
                } else {
                    event.target.value = item.quantity;
                }
            });

            const color = document.createElement('p');
            color.classList.add('card-text');
            color.textContent = `Couleur: ${item.color}`;

            const unitPrice = document.createElement('p');
            unitPrice.classList.add('card-text');
            unitPrice.textContent = `Prix unitaire: $${item.price.toFixed(2)}`;

            const totalPrice = item.quantity * item.price;
            totalAmount += totalPrice;

            const total = document.createElement('p');
            total.classList.add('card-text', 'fw-bold', 'text-end');
            total.textContent = `Total: $${totalPrice.toFixed(2)}`;

            const removeButton = document.createElement('button');
            removeButton.classList.add('btn', 'btn-danger', 'mt-3', 'me-2');
            removeButton.textContent = 'Supprimer';
            removeButton.addEventListener('click', () => {
                removeFromCart(item.id, item.color);
            });

            // Ajoute les éléments créés à la carte et au conteneur de l'article
            cardBody.appendChild(title);
            cardBody.appendChild(quantityInput);
            cardBody.appendChild(color);
            cardBody.appendChild(unitPrice);
            cardBody.appendChild(total);
            cardBody.appendChild(removeButton);

            card.appendChild(image);
            card.appendChild(cardBody);

            itemContainer.appendChild(card);
            cartItemsContainer.appendChild(itemContainer);
        });

        // Affiche le montant total du panier
        const totalAmountContainer = document.createElement('div');
        totalAmountContainer.classList.add('col-md-12', 'mt-4', 'text-end');
        totalAmountContainer.innerHTML = `<h4>Montant total du panier: $${totalAmount.toFixed(2)}</h4>`;
        cartItemsContainer.appendChild(totalAmountContainer);

        // Sélectionne le bouton pour vider le panier et lui ajoute un écouteur d'événement
        const clearCartButton = document.getElementById('clear-cart-btn');
        clearCartButton.addEventListener('click', () => {
            clearCart();
        });

        // Sélectionne le formulaire de paiement et lui ajoute un écouteur d'événement pour gérer la soumission du formulaire
        const checkoutForm = document.getElementById('checkout-form');
        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Récupère les données du formulaire
            const formData = new FormData(checkoutForm);

            const contact = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                address: formData.get('address'),
                city: formData.get('city'),
                email: formData.get('email')
            };

            // Crée un identifiant de commande unique
            const orderId = Date.now().toString();

            // Crée un objet de commande avec les détails nécessaires
            const order = {
                orderId: orderId,
                contact: contact,
                products: cart,
                totalAmount: totalAmount
            };

            // Stocke la commande dans le localStorage
            localStorage.setItem('order', JSON.stringify(order));

            // Affiche une alerte de confirmation et vide le panier
            alert('Commande confirmée avec succès !');
            clearCart();

            // Redirige vers la page de confirmation
            window.location.replace('confirmation.html');
        });
    };

    // Affiche initialement le contenu du panier
    displayCart();
});
