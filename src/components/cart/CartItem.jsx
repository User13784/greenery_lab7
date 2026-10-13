import React from 'react';

function CartItem({ item, onUpdateQuantity, onRemove }) {
  const itemTotal = item.price * item.quantity;

  const getTranslatedName = () => {
    const lang = localStorage.getItem('language') || 'en';
    return item.name[lang] || item.name.en;
  };

  return (
    <div className="cart-item">
      <img src={item.image} alt={getTranslatedName()} />
      <span className="cart-item-title">{getTranslatedName()}</span>
      <span className="cart-item-price">£{item.price.toFixed(2)}</span>
      <div className="quantity-control">
        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
      </div>
      <span className="cart-item-total">£{itemTotal.toFixed(2)}</span>
      <button className="remove-btn" onClick={() => onRemove(item.id)}>🗑️</button>
    </div>
  );
}

export default CartItem;