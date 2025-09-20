# Expenses App 📱

A Progressive Web App (PWA) for recording and tracking personal expenses, built with React, TypeScript and Tailwind CSS.

## 🚀 Main Features

- **Expense Recording**: Add expenses with amount, category, subcategory and notes
- **Categorization**: Flexible system of categories and subcategories
- **Card Payments**: Mark expenses as card payments for better tracking
- **Synchronization**: Automatic synchronization with server
- **PWA**: Installable as native app on mobile devices
- **Offline First**: Works without internet connection
- **Responsive Design**: Interface optimized for mobile and desktop

## 🛠️ Technologies

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **State**: React Query + Zustand
- **Forms**: React Hook Form + Zod
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **PWA**: Vite PWA

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/torrescristian/gastos.git
cd gastos
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🏗️ Project Structure

```
src/
├── modules/
│   ├── common/          # Shared components and utilities
│   ├── expenses/        # Expenses module
│   │   ├── domain/      # Entities and business logic
│   │   ├── infrastructure/ # Adapters and services
│   │   └── ui/          # Interface components
│   └── categories/      # Categories module
├── common/              # Global utilities
└── main.tsx            # Entry point
```

## 🎯 Technical Features

- **Hexagonal Architecture**: Clear separation between domain, infrastructure and UI
- **TypeScript**: Static typing for better maintainability
- **React Query**: Efficient server state management
- **Zustand**: Simple and efficient global state
- **Tailwind**: Utility styles for rapid development
- **PWA**: Installable and offline functionality

## 📱 Usage

1. **Record an Expense**:
   - Enter the amount
   - Select category and subcategory
   - Mark if it's a card payment
   - Add optional notes
   - Confirm the registration

2. **View Expenses**:
   - List of recent expenses
   - Filter by category
   - Search by text
   - Sort by date

3. **Install as PWA**:
   - On iOS: Share → "Add to Home Screen"
   - On Android: Menu → "Install App"

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT License - see the [LICENSE.md](LICENSE.md) file for more details.

## ✨ Upcoming Features

- [ ] Expense charts by category
- [ ] Data export
- [ ] Monthly budgets
- [ ] Payment reminders
- [ ] Multiple currencies
