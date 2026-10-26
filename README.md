# Greenery Lab 7 — PERN Stack Application

**Лабораторная работа № 7** 
**Тема:** Проектирование и реализация веб-приложения с многоуровневой архитектурой на основе стека PERN
**Вариант:** 20 — «Аптечный склад»

---

## 🎯 Цель работы

Практическое освоение разработки веб-приложений с использованием:
- **PostgreSQL** — реляционная СУБД
- **Sequelize** — ORM для Node.js
- **Express.js** — REST API
- **React** — клиентское приложение
- **Redux Toolkit** — state management
- **Axios** — HTTP-запросы
- **Postman** — тестирование API

---

## 📦 Предметная область

Аптечный склад РУП «БелФармация» осуществляет оптовую продажу лекарственных препаратов аптекам республики.

**Сущности:**
- **Лекарства** — код, название, производитель, цена, фото
- **Аптеки** — номер, название, адрес, телефон, фото
- **Заявки** — номер, аптека, дата составления, дата выполнения
- **Закупки** — заявка, лекарство, количество

**Связи:** Аптека `1:M` Заявка `1:M` Закупка `M:1` Лекарство

---

## 🏗️ Архитектура проекта

```text
greenery_lab7/
├── server/                # Express + Sequelize (Backend)
│   ├── config/            # Конфигурация БД (PostgreSQL)
│   ├── models/            # Модели: Pharmacy, Medicine, Order, Purchase
│   ├── migrations/        # Миграции
│   ├── seeders/           # Сиды (70 записей)
│   ├── routes/            # API-роуты
│   ├── backup.sql         # Backup БД
│   ├── backup.js          # Скрипт создания backup
│   └── index.js           # Точка входа сервера
│
├── src/                   # React (Frontend)
│   ├── app/               # Redux store
│   ├── features/          # Redux slices (medicines, pharmacies, orders, purchases, reports)
│   ├── components/pages/  # Страницы: Medicines, Pharmacies, Orders, Purchases, Reports
│   ├── services/api.js    # Axios-клиент
│   └── App.js
│
├── package.json
└── README.md