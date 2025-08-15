function loadPage(fileName) {
    $('#mobileMenu').hide();
    const pageMap = {
        'Main': 'Main.html',
        'Menu': 'Menu.html',
        'Story': 'Story.html',
        'Contact': 'Contact.html',
    };

    $('#Content').load(fileName, function () {
        $('#categoryFilter input[type=radio]').each(function () {
            this.checked = pageMap[$(this).val()] === fileName;
        });
        renderCartList();
    });
}

function getOrders() {
    try {
        return JSON.parse(localStorage.getItem("orderDetails")) || [];
    } catch (e) {
        console.error("Lỗi đọc orderDetails:", e);
        return [];
    }
}

function saveOrders(orders) {
    localStorage.setItem("orderDetails", JSON.stringify(orders));
    updateCountDisplay(orders);
    updateTotalAmount(orders);
}

function updateCountDisplay(orders) {
    const total = orders.reduce((sum, o) => sum + o.quantity, 0);
    $("#count").text(total).toggle(total > 0);
    if (total === 0) {
        $("#emptyCart").show();      // Hiện div trống giỏ hàng
        $("#cartContent").hide();    // Ẩn nội dung giỏ hàng
    } else {
        $("#emptyCart").hide();      // Ẩn div trống giỏ hàng
        $("#cartContent").show();    // Hiện nội dung giỏ hàng
    }
}

function updateTotalAmount(orders) {
    const total = orders.reduce((sum, o) => {
        const price = parseInt(o.price.replace(/[^\d]/g, ''));
        return sum + price * o.quantity;
    }, 0);
    const formatted = total.toLocaleString("vi-VN") + " ₫";
    $(".total, .subtotal").text(formatted);
}

function renderCartItem(o, i) {
    return `
    <div class="Cart flex" data-index="${i}">
        <div style="display:flex;align-items:center;gap:16px;">
            <div class="image-layout"><img src="${o.photo}" alt="${o.name}"></div>
            <div><strong>${o.name}</strong><br><span style="color:gray;">${o.price}</span></div>
        </div>
        <div class="quantity-wrapper">
            <div class="quantity-control">
                <a class="btn minus" data-index="${i}">−</a>
                <span class="count">${o.quantity}</span>
                <a class="btn plus" data-index="${i}">+</a>
            </div>
            <a class="flex remove-btn" data-index="${i}" title="Xoá">
                <svg stroke="#de2626" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                    <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke-width="2"/>
                </svg>
            </a>
        </div>
    </div>`;
}

function renderCartList() {
    const orders = getOrders();
    const $list = $('#list-carts').empty();
    orders.forEach((o, i) => $list.append(renderCartItem(o, i)));
    updateCountDisplay(orders);
    updateTotalAmount(orders);
}

function Addproduct(product) {
    const $p = $(product);
    const name = $p.find("h3").text().trim();
    const price = $p.find(".price").text().trim();
    const photo = $p.find("img").attr("src");

    const orders = getOrders();
    const found = orders.find(o => o.name === name);
    found ? found.quantity++ : orders.push({ name, price, photo, quantity: 1 });

    saveOrders(orders);
    renderCartList();
}

function clearCart() {
    localStorage.removeItem("orderDetails");
    renderCartList();
}

function toggleMenu() {
    $('#mobileMenu').slideToggle(200);
}

$(document).ready(function () {
    loadPage('Main.html');
    renderCartList();

    $(document).on('click', '.plus, .minus, .remove-btn', function () {
        const index = $(this).data('index');
        const orders = getOrders();

        if ($(this).hasClass('plus')) orders[index].quantity++;
        else if ($(this).hasClass('minus')) {
            if (orders[index].quantity > 1) orders[index].quantity--;
            else orders.splice(index, 1);
        } else if ($(this).hasClass('remove-btn')) {
            orders.splice(index, 1);
        }

        saveOrders(orders);
        renderCartList();
    });

    $(document).on('click', '.delete, #pay', e => {
        e.preventDefault();
        clearCart();
    });
});
