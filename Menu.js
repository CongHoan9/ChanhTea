function FilterProduct(key) {
    let visibleCount = 0;
    const keyword = key.trim();
    $('#list-products .product').each(function () {
        const $product = $(this);
        const match = (keyword === 'tất cả') ||
        (($product.data('category') || '').includes(keyword)) ||
        ($product.find('h3').text().includes(keyword));
        $product.toggle(match);
        if (match) visibleCount++;
    });
    $('.count').text(`Hiển thị ${visibleCount} sản phẩm`);
}

function SortProducts() {
    var sorted = $('#list-products .product').sort(function (a, b) {
        var priceA = parseInt($(a).find('.price').text().replace(/[^\d]/g, ''));
        var priceB = parseInt($(b).find('.price').text().replace(/[^\d]/g, ''));
        var nameA = $(a).find('h3').text().trim().toLowerCase();
        var nameB = $(b).find('h3').text().trim().toLowerCase();
        switch ($('#sort').val()) {
            case 'price-asc': return priceA - priceB;
            case 'price-desc': return priceB - priceA;
            case 'az': return nameA.localeCompare(nameB);
            case 'za': return nameB.localeCompare(nameA);
            default: return 0;
        }
    });
    $('#list-products').html(sorted);
}