// Attend que le document soit entièrement chargé avant d'exécuter la fonction
document.addEventListener('DOMContentLoaded', () => {
    // Récupère les informations de la commande stockées dans le localStorage
    const order = JSON.parse(localStorage.getItem('order'));

    // Vérifie si une commande existe dans le localStorage
    if (order) {
        // Sélectionne l'élément dans lequel les détails de la confirmation seront affichés
        const confirmationDetails = document.getElementById('confirmation-details');

        // Crée un élément de paragraphe pour afficher le numéro de commande
        const orderIdElement = document.createElement('p');
        orderIdElement.textContent = `Numéro de commande : ${order.orderId}`;

        // Crée un div pour les détails de contact et insère les informations HTML
        const contactDetails = document.createElement('div');
        contactDetails.innerHTML = `
            <h3>Détails de contact :</h3>
            <p><strong>Nom :</strong> ${order.contact.lastName}</p>
            <p><strong>Prénom :</strong> ${order.contact.firstName}</p>
            <p><strong>Adresse :</strong> ${order.contact.address}</p>
            <p><strong>Ville :</strong> ${order.contact.city}</p>
            <p><strong>Email :</strong> ${order.contact.email}</p>
        `;

        // Crée un div pour la liste des produits commandés et insère les informations HTML
        const productsList = document.createElement('div');
        productsList.innerHTML = `
            <h3>Produits commandés :</h3>
            <ul>
                ${order.products.map(product => `
                    <li>
                        <strong>${product.name}</strong> - Quantité : ${product.quantity} - Prix unitaire : $${product.price}
                    </li>
                `).join('')}
            </ul>
        `;

        // Crée un élément de paragraphe pour afficher le prix total de la commande
        const totalPriceElement = document.createElement('p');
        totalPriceElement.textContent = `Prix total de la commande : $${calculateTotalPrice(order.products)}`;

        // Ajoute les éléments créés à l'élément confirmationDetails
        confirmationDetails.appendChild(orderIdElement);
        confirmationDetails.appendChild(contactDetails);
        confirmationDetails.appendChild(productsList);
        confirmationDetails.appendChild(totalPriceElement);

        // Supprime la commande du localStorage après affichage
        localStorage.removeItem('order');
    } else {
        // Affiche une erreur dans la console si aucune commande n'est trouvée et redirige vers la page d'accueil
        console.error('Aucune commande trouvée.');
        window.location.href = '/';
    }
});

// Fonction pour calculer le prix total de la commande en multipliant la quantité par le prix de chaque produit
function calculateTotalPrice(products) {
    return products.reduce((total, product) => total + (product.quantity * product.price), 0);
}
