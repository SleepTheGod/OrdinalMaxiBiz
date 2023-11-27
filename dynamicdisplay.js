document.addEventListener('DOMContentLoaded', function() {
  fetch('tokenid.json')
    .then(response => response.json())
    .then(data => {
      const gallery = document.querySelector('.gallery');
      data.forEach(image => {
        const imageUrl = `https://ord-mirror.magiceden.dev/content/${image.tokenId}`;
        const itemClass = image.eyeColor; // Assuming this is a class like 'red', 'green', etc.
        let itemHtml = `<div class="gallery-item ${itemClass}">`;
        itemHtml += `<a href="https://magiceden.io/ordinals/item-details/${image.tokenId}" target="_blank">`;
        itemHtml += `<div class="image-container">`;
        itemHtml += `<img src="${imageUrl}" alt="Ordinal Maxi Biz #${image.tokenId}">`;
        if (image.price) {
          itemHtml += `<div class="price-tag">${image.price}</div>`;
        }
        itemHtml += `</div></a></div>`;
        gallery.innerHTML += itemHtml;
      });
    })
    .catch(error => console.error('Error loading image data:', error));
});
