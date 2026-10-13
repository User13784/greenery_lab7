export const i18n = {
  en: {
    home: 'Home',
    shop: 'Shop',
    favorites: 'Favorites',
    reviews: 'Reviews',
    cart: 'Cart',
    catalog: 'Catalog',
    admin: 'Admin',
    addToCart: 'Add to cart',
    inStock: 'In stock',
    outOfStock: 'Out of stock',
    emptyCart: 'Cart is empty',
    goToCatalog: 'Go to catalog',
    total: 'Total:',
    checkout: 'Checkout'
  },
  ru: {
    home: 'Главная',
    shop: 'Магазин',
    favorites: 'Избранное',
    reviews: 'Отзывы',
    cart: 'Корзина',
    catalog: 'Каталог',
    admin: 'Админ',
    addToCart: 'В корзину',
    inStock: 'В наличии',
    outOfStock: 'Нет в наличии',
    emptyCart: 'Корзина пуста',
    goToCatalog: 'Перейти в каталог',
    total: 'Итого:',
    checkout: 'Оформить заказ'
  }
};

export const getTranslation = (key, lang = 'en') => {
  return i18n[lang]?.[key] || i18n.en[key] || key;
};